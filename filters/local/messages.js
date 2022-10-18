export default {

    "bib-atrium": {
        msg: "Ce lien pointe vers <em>Atrium</em> alors qu'il devrait pointer vers Sofia. Veuillez le mettre à jour"
    },

    "bib-bad-adresses-simplifiees": {
        pattern: "^(http)(.+)$",
        substitution: "Utilisez la version sécurisée: $1s$2",
        msg: "Veuillez utiliser la version <code>https</code> de cette adresse."
    },

    "bib-communication-lien-manquant": {
        msg: "Cette nouvelle n'a pas d'URL."
    },

    "bib-guides-bib-umontreal-ca": {
        msg: "Ce lien pointe vers https://guides.bib.umontreal.ca/... Or ce serveur va être prochainement fermé. Utilisez plutôt LibGuides pour héberger vos fichiers."
    },

    "bib-https-upgrade": {
        msg: "L'adresse a changé",
        pattern: "(.+)",
        substitution: "L'adresse a changé. Veuillez utiliser $1."
    },

    "bib-lien-guide-embed": {
        msg: "Utilisez l'URL publique du guide, celle débutant par <code class=\"cvw-url\">https://bib.umontreal.ca/</code>...."
    },

    "bib-lien-be-typo3": {
        msg: "Évitez ces liens <code class=\"cvw-url\">http://bib.umontreal.ca/index.php?id=12345</code> générés par TYPO3. Utilisez plutôt le lien tel qu'obtenu en navigant dans le site."
    },

    "bib-lien-developpement-edimestre": {
        msg: "Ce lien pointe vers l'espace de développement de l'édimestre. Ces pages ne sont pas destinées à être rendues publiques."
    },

    "bib-lien-guides-with-old-tab": {
        msg: "Ce lien pointe vers À La Carte. Veuillez mettre à jour le numéro de tab dans l'URL."
    },

    "bib-lien-libguides": {
        msg: "Ce lien pointe vers un guide hébergé sur LibGuides (<code>https://libguides.bib.umontreal.ca/c.php?...</code>). Utilisez plutôt une adresse pointant vers le guide sur le site Web des bibliothèques (<code>https://bib.umontreal.ca/...</code>)"
    },

    // "bib-lien-libelle": {
    //     msg: "Il est préférable d'utiliser des mots significatifs (par exemple le titre de la page) plutôt que l'adresse URL comme texte cliquable. Exception fréquentes : lorsque l'URL est citée dans une référence bibliographique; ou encore lorsqu'on on cite une adresse simplifiée. <span class=\"texte-petit\">( <a href=\"http://mentor.bib.umontreal.ca/comite-web/bpub/outils/Contribute/Aide-m%C3%A9moire%20Contribute.docx\" target=\"_blank\">plus d'infos</a>) </span>. "
    // },

    "bib-Maestro": {
        "code": "bib-Maestro",
        "msg": "Ce lien pointe vers Maestro. Veuillez utiliser la nouvelle liste de bases de données de A à Z (<a href=\"https://libguides.bib.umontreal.ca/az.php\" target=\"_blank\"><code>https://libguides.bib.umontreal.ca/az.php</code></a>)"
    },

    "bib-wrong-domain": {
        msg: "Veuillez utiliser une adresse débutant par <code>http://<strong>www.</strong>bib.umontreal.ca</code> dans les liens hypertextes plutôt que <code>http://bib.umontreal.ca</code>. Ceci évite une redirection inutile."
    },

    "bib-retrait-di": {
        msg: "Le site de la Didacthèque a été retiré. Veuillez corriger le lien."
    },

    "pup-timeout-redirect": {
        msg: "Redirection permanente. Vous devez mettre à jour ce lien.",
        pattern: "(.+)",
        substitution: "Redirection permanente vers <code class=\"cvw-url\">$1</code>. Vous devez mettre à jour ce lien.",
    },

}