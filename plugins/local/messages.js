export default {

    // "atrium-ancien-interface-http-30x": {
    //     code: "atrium-ancien-interface-http-30x",
    //     msg: "Ce lien pointe vers l'ancienne interface d'Atrium. Veuillez le mettre à jour (<a href=\"http://mentor.bib.umontreal.ca/form-doc/guides/Documents%20partages/Instructions%20aux%20auteurs%20de%20guides%20ALC%20Atrium%20nouvel%20UI.pdf\" target=\"_blank\">aide</a>). "
    // },

    // "atrium-ancien-interface-http-40x": {
    //     code: "atrium-ancien-interface-http-40x",
    //     msg: "Ce lien pointe vers l'ancienne interface d'Atrium, et ne fonctionne probablement pas. Veuillez le mettre à jour (<a href=\"http://mentor.bib.umontreal.ca/form-doc/guides/Documents%20partages/Instructions%20aux%20auteurs%20de%20guides%20ALC%20Atrium%20nouvel%20UI.pdf\" target=\"_blank\">aide</a>). "
    // },

    // "atrium-ancien-interface1-http-40x": {
    //     code: "atrium-ancien-interface1-http-40x",
    //     msg: "Ce lien pointe vers l'ancienne interface d'Atrium, et ne fonctionne probablement pas. Veuillez le mettre à jour (<a href=\"http://mentor.bib.umontreal.ca/form-doc/guides/Documents%20partages/Instructions%20aux%20auteurs%20de%20guides%20ALC%20Atrium%20nouvel%20UI.pdf\" target=\"_blank\">aide</a>). "
    // },

    // "atrium-ancien-aide-http-30x": {
    //     code: "atrium-ancien-aide-http-30x",
    //     msg: "Le lien vers l'aide d'Atrium est désormais: <code><a href=\"http://atrium.umontreal.ca/aide\" target=\"_blank\">http://atrium.umontreal.ca/aide</a></code>"
    // },

    // "atrium-www-domain": {
    //     code: "atrium-www-domain",
    //     msg: "Lien pointant vers <code><strong>www</strong>.atrium.umontreal.ca</code> au lieu de <code>atrium.umontreal.ca</code>."
    // },

    "bib-atrium": {
        code: "bib-atrium",
        msg: "Ce lien pointe vers <em>Atrium</em> alors qu'il devrait pointer vers Sofia. Veuillez le mettre à jour"
    },

    "bib-ancien-atrium": {
        code: "bib-ancien-atrium",
        msg: "Ce lien pointe vers une ancienne version. Veuillez le mettre à jour"
    },

    "bib-atrium-non-securise": {
        code: "bib-atrium-non-securise",
        msg: "Veuillez utiliser la version <code>https</code> de cette adresse."
    },

    "bib-bad-adresses-simplifiees": {
        code: "bib-bad-adresses-simplifiees",
        pattern: "^(http)(.+)$",
        substitution: "Utilisez la version sécurisée: $1s$2",
        msg: "Veuillez utiliser la version <code>https</code> de cette adresse."
    },

    "bib-https-upgrade": {
        code: "bib-https-upgrade",
        msg: "L'adresse a changé",
        pattern: "(.+)",
        substitution: "L'adresse a changé. Veuillez utiliser $1."
    },

    "bib-lien-guide": {
        code: "bib-lien-guide",
        msg: "Utilisez l'URL publique du guide, celle débutant par <code class=\"cvw-url\">https://bib.umontreal.ca/</code>...."
    },

    "bib-lien-be-typo3": {
        code: "bib-lien-be-typo3",
        msg: "Évitez ces liens <code class=\"cvw-url\">http://bib.umontreal.ca/index.php?id=12345</code> générés par TYPO3. Utilisez plutôt le lien tel qu'obtenu en navigant dans le site."
    },

    // "bib-lien-bibres": {
    //     code: "bib-lien-bibres",
    //     msg: "Ce lien pointe vers WebPublic ou WebTest (http://bibres.bib.umontreal.ca:8...). Veuillez utiliser un lien pointant vers le site public (https://bib.umontreal.ca/...)"
    // },

    // "bib-lien-libelle": {
    //     code: "bib-lien-libelle",
    //     msg: "Il est préférable d'utiliser des mots significatifs (par exemple le titre de la page) plutôt que l'adresse URL comme texte cliquable. Exception fréquentes : lorsque l'URL est citée dans une référence bibliographique; ou encore lorsqu'on on cite une adresse simplifiée. <span class=\"texte-petit\">( <a href=\"http://mentor.bib.umontreal.ca/comite-web/bpub/outils/Contribute/Aide-m%C3%A9moire%20Contribute.docx\" target=\"_blank\">plus d'infos</a>) </span>. "
    // },
    
    "bib-permalien-sfx": {
    			"code": "bib-permalien-sfx",
    			"msg": "Ce lien pointe vers le serveur SFX. Veuillez utiliser la nouvelle liste de bases de données de A à Z (<a href=\"https://libguides.bib.umontreal.ca/az.php\" target=\"_blank\">https://libguides.bib.umontreal.ca/az.php</a>")"
    	},

    // "bib-lien-primo-test": {
    //     code: "bib-lien-primo-test",
    //     msg: "Ce lien pointe vers la version de tests d'<em>Atrium</em> ( <code>http://primo-test.bib.umontreal.ca</code>...). Veuillez utiliser l'instance publique d'Atrium (<code>http://atrium.umontreal.ca/</code>...)"
    // },

    // "bib-lien-simplifie-gif": {
    //     code: "bib-lien-simplifie-gif",
    //     msg: "Lien simplifié désuet. L'extension de fichier <code>.htm</code> a été remplacée par <code>.aspx</code>."
    // },

    "bib-wrong-domain": {
        code: "bib-wrong-domain",
        msg: "Veuillez utiliser une adresse débutant par <code>http://<strong>www.</strong>bib.umontreal.ca</code> dans les liens hypertextes plutôt que <code>http://bib.umontreal.ca</code>. Ceci évite une redirection inutile."
    },

    "bib-retrait-di": {
        code: "bib-retrait-di",
        msg: "Le site de la Didacthèque a été retiré. Veuillez corriger le lien."
    },

}