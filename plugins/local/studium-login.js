export default {
    code: 'studium-login',
    test: (report) => {
        return 'finalUrl' in report && typeof report.finalUrl === 'string' && (
            report.finalUrl === 'https://studium.umontreal.ca/my.policy' ||
            report.finalUrl.startsWith('https://studiumfc.umontreal.ca/login')
        );
    },
    level: 'info',
    exclude: true
}