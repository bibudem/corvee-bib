# Changelog

## 3.0.0 (2025-12-23)


### Features

* Added example config file. ([e2a6734](https://github.com/bibudem/corvee-bib/commit/e2a67342347c71032570e8ce69c93168aeb2e7c9))
* Ajout de documentation dans le fichier README.md ([e11ee7f](https://github.com/bibudem/corvee-bib/commit/e11ee7fc3a24d95e42b32be9c2881ca853278082))
* Ajout de documentation dans le fichier README.md ([9e8e866](https://github.com/bibudem/corvee-bib/commit/9e8e866557a191c23b098a318396bf35778642f4))
* Corvée vérifie maintenant les images dans les pages. ([89e7afc](https://github.com/bibudem/corvee-bib/commit/89e7afc0d106ead7fb650b7696e6ab2e2ab5073a))
* **filter:** Ajout d'un filtre pour identifier les liens TYPO3 internes ([45698dd](https://github.com/bibudem/corvee-bib/commit/45698dddd929614d0b96e8b419a6b70c9f9cb18f))
* **filter:** Ajout d'un filtre pour les redirections Outlook ([456123e](https://github.com/bibudem/corvee-bib/commit/456123e5475a127255f4bce8b1be575e0f7808bf))
* **filter:** Ajout de Microsoft à la liste des services d'authentification ([e2648c6](https://github.com/bibudem/corvee-bib/commit/e2648c66d4d0415e1b33ebd837782e3f9707be32))
* **filter:** Ajout de patrons d'URLs pour détecter des 404 ([31796c7](https://github.com/bibudem/corvee-bib/commit/31796c743893b183b89bb3ced319ee42a1affd31))
* **filter:** Ajout et retrait de filtres ([7f8eb13](https://github.com/bibudem/corvee-bib/commit/7f8eb130f6846987ef53f5f496b8263a1ac2f4a7))
* **filter:** Retrait de la limite de rapports du filtre http-30x-https-upgrade-scrict ([5714661](https://github.com/bibudem/corvee-bib/commit/5714661708d326cc90167a209395e960feabef88))
* Fixed example config file. ([f70b711](https://github.com/bibudem/corvee-bib/commit/f70b711e45ed7ede8e1f250d492093ce3d76e383))
* Fixed example config file. ([5e24c43](https://github.com/bibudem/corvee-bib/commit/5e24c43bf541d10d212d1c1b82497e6d0b865a9b))
* **harvester:** Ajout de scholaris dans les liens internes du site ([37534fb](https://github.com/bibudem/corvee-bib/commit/37534fb1d6b0761cf51d401f05293a012b9ba2c8))
* **harvester:** Exclusion des nouvelles du moissonnage ([b4e4509](https://github.com/bibudem/corvee-bib/commit/b4e45094673347c81a31ee14eff404869833bced))
* **harvester:** Ne pas indexer les pages de Scholaris. ([d9d78c5](https://github.com/bibudem/corvee-bib/commit/d9d78c582407ea572f48cf52932e4d92d79d28de))
* **harvester:** Ne pas moissonner dans les URLs internes à TYPO3 (https://bib.umontreal.ca/index.php?id=) ([5ea57d6](https://github.com/bibudem/corvee-bib/commit/5ea57d68d721df2afa33cad528db1e45ab680902))
* **harvester:** Ne pas moissonner les liens de la section de développement de l'édimestre ([125b673](https://github.com/bibudem/corvee-bib/commit/125b6731623854101dcd71b972f2f66b0681f4aa))
* **harvester:** Ne pas moissonner les pages situées sur docs.bib.umontreal.ca ([8a0b88e](https://github.com/bibudem/corvee-bib/commit/8a0b88e663423466e00cec3395fad2efcabad8e4))
* Les titres de pages avaient parfois le suffix " - Bibliothèques - Université de Montréal" ([410c709](https://github.com/bibudem/corvee-bib/commit/410c7093e31d0a7278bb3804c5cda3a26ccde58c))
* Renommage des modules corvee-* par @corvee/* ([8892f99](https://github.com/bibudem/corvee-bib/commit/8892f99a8a08699a4ba0d23ba2b345bd704b647a))
* **script:** Amélioration de l'aide du script find-route ([9b3612e](https://github.com/bibudem/corvee-bib/commit/9b3612e50a2165c0c6f66846395d6baaf5e8bc07))
* **sections:** Ajout d'une section "Autres" ([58c039b](https://github.com/bibudem/corvee-bib/commit/58c039b31f04a949734fc815ce71132bb1d4c656))
* **sections:** Mise à jour de la liste des sections du site. ([0adfb09](https://github.com/bibudem/corvee-bib/commit/0adfb099c78a34d5d9ceac54df8e669428d46a95))


### Bug Fixes

* **filter:** Ajustement d'un filtre afin de capturer les liens utilisant l'ancien nom de Libguides. ([79a8cf2](https://github.com/bibudem/corvee-bib/commit/79a8cf29eba49f53bc5a75f53523848392c7a836))
* **filter:** Ajustement découlant du nouveau site Web. ([afd4315](https://github.com/bibudem/corvee-bib/commit/afd4315e0328fd049fdab98471aa65e6d0598cd2))
* **filter:** Suppression de 2 filtres rendus inutiles avec l'architecture du nouveau site. ([ad358b4](https://github.com/bibudem/corvee-bib/commit/ad358b4a3930cc8892bdae76e206e0460cbd6d94))
* **harvester:** Correction du script qui génère les "page snippets" afin de l'ajuster à la nouvelle réalité de nos sites Web. ([7dc4b5c](https://github.com/bibudem/corvee-bib/commit/7dc4b5cffd36b1333382ff7f1f5b1ecfb3caf76b))
* **parser:** Amélioration de l'extraction du texte des liens ([35a0c8d](https://github.com/bibudem/corvee-bib/commit/35a0c8d0a456fdb6c7c955cb75a28c8529d4edaf))
* **parser:** Les liens dans les fils RSS (LibGuides) n'étaient pas toujours exclus. ([a8b28fa](https://github.com/bibudem/corvee-bib/commit/a8b28fa61fc5f88d47eb0b0b6de639719ead50aa))
* **parser:** Misc ([b6fb7ac](https://github.com/bibudem/corvee-bib/commit/b6fb7ac46900872f21d4648f4dcb594217449ea1))


### Miscellaneous Chores

* release 2.0.0 ([75f1fef](https://github.com/bibudem/corvee-bib/commit/75f1fefecad999d9ffb89aac0ea316c6721b80e6))
* release 3.0.0 ([9e08e49](https://github.com/bibudem/corvee-bib/commit/9e08e49230aefe70f901b5c677e67f84aa8574b3))

## [2.1.0](https://github.com/bibudem/corvee-bib/compare/v2.0.0...v2.1.0) (2024-01-09)


### Features

* **filter:** Ajout de Microsoft à la liste des services d'authentification ([e2648c6](https://github.com/bibudem/corvee-bib/commit/e2648c66d4d0415e1b33ebd837782e3f9707be32))
* **filter:** Ajout de patrons d'URLs pour détecter des 404 ([31796c7](https://github.com/bibudem/corvee-bib/commit/31796c743893b183b89bb3ced319ee42a1affd31))
* **filter:** Retrait de la limite de rapports du filtre http-30x-https-upgrade-scrict ([5714661](https://github.com/bibudem/corvee-bib/commit/5714661708d326cc90167a209395e960feabef88))
* **harvester:** Exclusion des nouvelles du moissonnage ([b4e4509](https://github.com/bibudem/corvee-bib/commit/b4e45094673347c81a31ee14eff404869833bced))
* **harvester:** Ne pas moissonner dans les URLs internes à TYPO3 (https://bib.umontreal.ca/index.php?id=) ([5ea57d6](https://github.com/bibudem/corvee-bib/commit/5ea57d68d721df2afa33cad528db1e45ab680902))
* **harvester:** Ne pas moissonner les liens de la section de développement de l'édimestre ([125b673](https://github.com/bibudem/corvee-bib/commit/125b6731623854101dcd71b972f2f66b0681f4aa))
* **harvester:** Ne pas moissonner les pages situées sur docs.bib.umontreal.ca ([8a0b88e](https://github.com/bibudem/corvee-bib/commit/8a0b88e663423466e00cec3395fad2efcabad8e4))
* **sections:** Ajout d'une section "Autres" ([58c039b](https://github.com/bibudem/corvee-bib/commit/58c039b31f04a949734fc815ce71132bb1d4c656))


### Bug Fixes

* **parser:** Amélioration de l'extraction du texte des liens ([35a0c8d](https://github.com/bibudem/corvee-bib/commit/35a0c8d0a456fdb6c7c955cb75a28c8529d4edaf))
* **parser:** Les liens dans les fils RSS (LibGuides) n'étaient pas toujours exclus. ([a8b28fa](https://github.com/bibudem/corvee-bib/commit/a8b28fa61fc5f88d47eb0b0b6de639719ead50aa))
* **parser:** Misc ([b6fb7ac](https://github.com/bibudem/corvee-bib/commit/b6fb7ac46900872f21d4648f4dcb594217449ea1))

## [2.0.0](https://github.com/bibudem/corvee-bib/compare/2.0.0-beta.7...v2.0.0) (2023-06-13)


### Features

* **filter:** Ajout d'un filtre pour identifier les liens TYPO3 internes ([45698dd](https://github.com/bibudem/corvee-bib/commit/45698dddd929614d0b96e8b419a6b70c9f9cb18f))
* Les titres de pages avaient parfois le suffix " - Bibliothèques - Université de Montréal" ([410c709](https://github.com/bibudem/corvee-bib/commit/410c7093e31d0a7278bb3804c5cda3a26ccde58c))


### Miscellaneous Chores

* release 2.0.0 ([75f1fef](https://github.com/bibudem/corvee-bib/commit/75f1fefecad999d9ffb89aac0ea316c6721b80e6))
