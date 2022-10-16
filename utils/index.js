export const sanitiseUrlPath = (url) => {
    const { pathname } = new URL(url)
    // slugify the pathname, replacing all special characters with a dash
    const slug = pathname.replace(/[^a-zA-Z0-9]/g, '-')
    // remove any double dashes, leading and trailing dashes
    const cleanSlug = slug.replace(/--/g, '-').replace(/^-|-$/g, '')

    return cleanSlug.length > 0 ? cleanSlug : 'index'
}
