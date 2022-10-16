export const validateUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch (error) {
        throw new Error(`Invalid URL: ${url}`)
    }
}
