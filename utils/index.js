export const sanitiseUrlPath = (url) => {
    const { pathname } = new URL(url)
    return pathname.replace(/\//g, '_')
}
