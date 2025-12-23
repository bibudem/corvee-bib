# corvee-bib

L'implémentation de la librairie @corvee pour vérifier les liens du site Web de la Direction des bibliothèques de l'Université de Montréal.

## Installation

```
npm install
```

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

Dans MongoDB Compass, connectez-vous à la base Corvée, puis versez dans la collection `harvested` le fichier `<job>_harvested.json`, puis versez le fichier `<job>_harvested.json` dans la collection `reports`.

Les données de la collection reports doivent ensuite être convertis dans un format plus approprié pour le serveur Corvée. Ceci est fait via une suite de tâches d'aggrégations effectuées depuis la collection `reports`. Le fruit de ces aggrégations est ensuite versé dans la collection `links`. C'est cette collection qui est utilisée par le serveur Corvée.

**Génération de l'index de recherche**

Le site de Corvée comprend un moteur de recherche, lequel nécessite quelques opérations afin de peupler l'index de recherche.

**Création du fichier d'index**

```
npm run index -- --job=2025-12-18
```

**Versement du fichier d'index auprès du service chargé de la recherche (Algoliasearch) sur le site de Corvée**

```
npm run upload -- --job=2025-12-18
```

## Base de données

La base de données MongoDB doit comporter 3 collections :

- `harvested` Contient les données collectées, avant traitement. Utilisée pour interroger les données relatives à la structure de notre site web ;
- `processed` Contient les données collectées qui ont été traitées avec `npm run process... ;
- `links` Données utilisées par le serveur Corvée. Ces données proviennent de la collection `processed `. Leur structure a été adaptée aux besoins du serveur Corvée à l'aide d'une chaîne d'aggrégation dans MongoDB Compass.

## Licence

Ce projet est sous licence MIT. Veuillez consulter le fichier `LICENSE` pour plus d'informations.
