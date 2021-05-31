const authServices = [
    /https?:\/\/accounts\.google\.com/i
]

export default {
    code: 'public-auth-service',
    test: r => {
        return [r.finalUrl, ...(r.redirectChain || [])].some(url => {
            return authServices.some(authService => {
                return typeof authService === 'string' ? url.includes(authService) : authService.test(url);
            })
        })
    },
    level: 'info'
}