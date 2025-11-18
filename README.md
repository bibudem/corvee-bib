# corvee-bib

This is the

## Database

La base de données MongoDB doit comporter 3 collections :

- `harvested` Contient les données collectées, avant traitement. Utilisée pour interroger les données relatives à la structure de notre site web ;
- `processed` Contient les données collectées qui ont été traitées avec `npm run process... ;
- `links` Données utilisées par le serveur Corvée. Ces données proviennent de la collection `processed `. Leur structure a été adaptée aux besoins du serveur Corvée par la tâche npm `upload`.

## Licence

Ce projet est sous licence MIT. Veuillez consulter le fichier `LICENSE` pour plus d'informations.
