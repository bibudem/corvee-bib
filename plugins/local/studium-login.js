export default {
    code: 'studium-login',
    test: (record) => {
        return (
            typeof record.finalUrl === 'string' &&
            (
                record.finalUrl === 'https://studium.umontreal.ca/my.policy' ||
                record.finalUrl.startsWith('https://studiumfc.umontreal.ca/login')
            )
        )
            || (
                record.url.startsWith('https://studium.umontreal.ca/pluginfile.php')
                && record.httpStatusCode === 404
            );
    },
    level: 'info',
    exclude: true
}