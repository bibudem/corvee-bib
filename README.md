# corvee-bib

L'implémentation de la librairie @corvee pour vérifier les liens du site Web de la Direction des bibliothèques de l'Université de Montréal.

## Prérequis

- Node.js version 18.1.0 ou supérieure (voir le champ `engines` de `package.json`).
- Une instance MongoDB accessible (locale ou distante), pour le versement et la lecture des données.
- Un compte Algoliasearch (`applicationId` et `writeApiKey`) si vous prévoyez exécuter la tâche de téléversement de l'index de recherche.
- Le dépôt [`@corvee`](../corvee) cloné en tant que dossier voisin (`../corvee`), avec ses dépendances installées (`npm ci` à la racine de ce dépôt — voir son [README](../corvee/README.md)). En effet, `package.json` référence les paquets `core`, `harvester` et `processor` via des chemins locaux (`file:../corvee/packages/...`) plutôt que via le registre npm ; aucune compilation n'est requise, mais Playwright (utilisé par `@corvee/harvester`) doit pouvoir télécharger son navigateur Chromium lors de cette installation.

> **Important — ordre d'installation** : le dépôt `@corvee` doit être installé (`npm ci`) **avant** `corvee-bib`. Les paquets `@corvee/core`, `@corvee/harvester` et `@corvee/processor` étant référencés par chemin local plutôt que via le registre npm, la résolution des dépendances de ces paquets (Crawlee, Playwright, etc.) se fait dans `node_modules` du dépôt `@corvee` lui-même. Si ce dépôt n'a pas été installé au préalable, l'installation de `corvee-bib` restera incomplète, même si elle semble réussir.

## Installation

Utilisez `npm ci` plutôt que `npm install` pour installer les dépendances :

```
npm ci
```

`npm ci` installe les paquets strictement à partir des versions verrouillées dans `package-lock.json`, sans les recalculer. Cela garantit une installation reproductible, identique sur tous les postes et en intégration continue, et évite les erreurs ou incohérences de versions qui peuvent survenir avec `npm install` lorsque `package-lock.json` est mis à jour de façon inattendue. À noter que `npm ci` supprime d'abord le dossier `node_modules` existant ; le `package.json` et le `package-lock.json` doivent être synchronisés (aucune modification manuelle du premier sans régénération du second).

## Configuration

Le projet requiert un fichier de configuration locale non versionné (`config/local.js`, exclu par `.gitignore`), à créer à partir du gabarit fourni :

```
cp config/local.EXAMPLE.js config/local.js
```

Complétez ensuite `config/local.js` avec :

- `db` / `dbLocal` : les paramètres de connexion à votre base MongoDB (`url`, identifiants, `authSource`, nom de la base) ;
- `algoliasearchOptions` : l'identifiant d'application et la clé d'écriture Algoliasearch, ainsi que le nom de l'index à utiliser.

## Moissonnage

```
npm run harvest
```

L'extrant de cette commande est sauvegardé dans un fichier `json` dans le dossier `data` du projet. Le nom du fichier prend la forme:

```
<nom de la job>_harvested.json
```

**Exemple**

```
data/2025-12-18_harvested.json
```

Ce fichier sera le point d'entrée des tâches qui suivent.

## Analyse et publication

Exécutez dans l'ordre les commandes suivantes afin d'exécuter l'analyse et le filtrage des données moissonnées, et aussi pour préparer le serveur Corvée pour l'affichage des données.

### Traitement des données

```
npm run process -- --job=<identifiant de la job>
```

L'identifiant est généré automatiquement lors du moisonnage, et prend la forme de la date du jour où le moisonnage a eu lieu, en format ISO 8601. Par exemple:

```
npm run process -- --job=2025-12-18
```

L'extrant de cette commande est un fichier `json` situé dans le dossier `data`. Par exemple:

```
data/2025-12-18_processed.json
```

Versement des données dans la base de données MongoDB

Les fichiers `<job>_harvested.json` et `<job>_processed.json` doivent ensuite être versés dans la base de données MongoDB du serveur Corvée. Pour ce faire, utilisez l'utilitaire MongoDB Compass.

Dans MongoDB Compass, connectez-vous à la base Corvée, puis versez dans la collection `harvested` le fichier `<job>_harvested.json`, puis versez le fichier `<job>_processed.json` dans la collection `reports`.

Les données de la collection reports doivent ensuite être convertis dans un format plus approprié pour le serveur Corvée. Ceci est fait via une suite de tâches d'aggrégations effectuées depuis la collection `reports`. Le fruit de ces aggrégations est ensuite versé dans la collection `links`. C'est cette collection qui est utilisée par le serveur Corvée.

Voici le script d'aggrégation à utiliser (mettez à jour la date de la variable job avant de l'exécuter):

```javascript
;[
  {
    $match: {
      job: '2026-05-20',
    },
  },
  {
    $set: {
      messages: {
        $reduce: {
          input: '$reports',
          initialValue: '',
          in: {
            $concat: ['$$value', '<msg error-code="', '$$this.code', '">', '$$this.message', '</msg>'],
          },
        },
      },
    },
  },
  {
    $set: {
      errorCodes: {
        $map: {
          input: '$reports',
          in: {
            $concat: ['$$this.code'],
          },
        },
      },
    },
  },
  {
    $set: {
      linkId: '$id',
      action: 'to-be-fixed',
    },
  },
  {
    $set: {
      status: {
        $switch: {
          branches: [
            {
              case: {
                $in: ['error', '$reports.level'],
              },
              then: 'error',
            },
            {
              case: {
                $in: ['warning', '$reports.level'],
              },
              then: 'warning',
            },
          ],
          default: 'info',
        },
      },
    },
  },
  {
    $unset: ['_id', 'contentLength', 'created', 'httpStatusCode', 'httpStatusText', 'id', 'size', 'trials', 'level', '_from', '_filtered', 'timing', 'isNavigationRequest', 'redirectChain', 'resourceType', 'reports'],
  },
  {
    $merge: {
      into: 'links',
      whenMatched: 'replace',
    },
  },
]
```

**Génération de l'index de recherche**

Le site de Corvée comprend un moteur de recherche, lequel nécessite quelques opérations afin de peupler l'index de recherche.

**Création du fichier d'index**

```
npm run index -- --job=2025-12-18
```

**Versement du fichier d'index auprès du service Algoliasearch chargé de la recherche sur le site de Corvée**

```
npm run upload -- --job=2025-12-18
```

Cette tâche télé-verse sur Algoliasearch l'index généré.

## Base de données

La base de données MongoDB doit comporter 3 collections :

- `harvested` Contient les données collectées, avant traitement. Utilisée pour interroger les données relatives à la structure de notre site web ;
- `processed` Contient les données collectées qui ont été traitées avec `npm run process... ;
- `links` Données utilisées par le serveur Corvée. Ces données proviennent de la collection `processed `. Leur structure a été adaptée aux besoins du serveur Corvée à l'aide d'une chaîne d'aggrégation dans MongoDB Compass.

## Démarrage rapide

Pour installer et exécuter correctement le projet de A à Z :

1. **Cloner le dépôt [`@corvee`](../corvee)** en tant que dossier voisin (`../corvee`) et y exécuter `npm ci` (voir son [README](../corvee/README.md)), puisque ses paquets (`core`, `harvester`, `processor`) sont référencés localement dans `package.json`.
2. **Installer les dépendances** du projet avec `npm ci` (voir [Installation](#installation)).
3. **Créer et compléter `config/local.js`** à partir de `config/local.EXAMPLE.js` (voir [Configuration](#configuration)), avec les accès MongoDB et, si nécessaire, Algoliasearch.
4. **Démarrer une instance MongoDB** accessible et vous assurer qu'elle comporte les 3 collections attendues (`harvested`, `processed`, `links`) — voir [Base de données](#base-de-données).
5. **Lancer le moissonnage** du site Web avec `npm run harvest` afin de générer le fichier `data/<job>_harvested.json`.
6. **Traiter les données moissonnées** avec `npm run process -- --job=<identifiant de la job>` afin de générer `data/<job>_processed.json`.
7. **Verser les fichiers `harvested` et `processed`** dans les collections MongoDB correspondantes via MongoDB Compass, puis exécuter la chaîne d'agrégation fournie pour peupler la collection `links`.
8. **Générer l'index de recherche** avec `npm run index -- --job=<identifiant de la job>`, puis le téléverser vers Algoliasearch avec `npm run upload -- --job=<identifiant de la job>`.

Une fois ces étapes complétées, le serveur Corvée dispose de toutes les données nécessaires (liens, rapports et index de recherche) pour fonctionner correctement.

## Licence

Ce projet est sous licence MIT. Veuillez consulter le fichier `LICENSE` pour plus d'informations.
