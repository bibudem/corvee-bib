# Changelog

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
