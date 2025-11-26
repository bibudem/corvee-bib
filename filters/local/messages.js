export default {

    "bib-atrium": {
        msg: "Ce lien pointe vers <em>Atrium</em> alors qu'il devrait pointer vers Sofia. Veuillez le mettre à jour"
    },

    "bib-bad-adresses-simplifiees": {
        pattern: "(.+)",
        substitution: "Utilisez la version sécurisée: <code class=\"cvw-url\">$1</code> de cette adresse simplifiée.",
        msg: "Veuillez utiliser la version <code>https</code> de cette adresse simplifiée."
    },

    "bib-communication-lien-manquant": {
        msg: "Cette nouvelle n'a pas d'URL."
    },

    "bib-gif": {
        pattern: "(.+)",
        substitution: "Ce lien mène à l'application GIF (<a href=\"$1\"><code class=\"cvw-url\">$1</code></a>). Veuillez plutôt utiliser l'application Calendrier LibCal (<a href=\"https://bib.umontreal.ca/formations/calendrier\"><code class=\"cvw-url\">https://bib.umontreal.ca/formations/calendrier</code></a>).",
        msg: "Ce lien mène à l'application GIF. Veuillez plutôt utiliser l'application Calendrier LibCal."
    },

    "bib-https-upgrade": {
        msg: "L'adresse a changé",
        pattern: "(.+)",
        substitution: "L'adresse a changé. Veuillez utiliser $1."
    },

    "bib-lien-libguides-admin": {
        msg: "Ce lien pointe vers l'interface d'administration de LibGuides. Utilisez plutôt une adresse publique du guide (<code>https://boite-outils.bib.umontreal.ca/...</code>)."
    },

    "bib-Maestro": {
        code: "bib-Maestro",
        msg: "Ce lien pointe vers Maestro. Veuillez utiliser la nouvelle liste de bases de données de A à Z (<a href=\"https://boite-outils.bib.umontreal.ca/az.php\"><code class=\"cvw-url\">https://boite-outils.bib.umontreal.ca/az.php</code></a>)"
    },

    "microsoft-outlink-safelink-protection": {
        msg: "Le lien utilisé est une redirection Outlook. Utilisez plutôt le lien direct (final) vers la ressource."
    },

    "pup-timeout-redirect": {
        msg: "Redirection permanente. Vous devez mettre à jour ce lien.",
        pattern: "(.+)",
        substitution: "Redirection permanente vers <code class=\"cvw-url\">$1</code>. Vous devez mettre à jour ce lien.",
    },

}