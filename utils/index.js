export const sanitiseUrlPath = (url) => {
    const { pathname } = new URL(url)
    // slugify the pathname, replacing all special characters with a dash
    const slug = pathname.replace(/[^a-zA-Z0-9]/g, '-')
    // remove any double dashes, leading and trailing dashes
    const cleanSlug = slug.replace(/--/g, '-').replace(/^-|-$/g, '')

    return cleanSlug.length > 0 ? cleanSlug : 'index'
}

/**
 * @param {number} bytes
 * @returns {number} - the number of grams of CO2 emitted
 */
export const estimateEmissions = (bytes, co2js) => {
    const emissions = co2js.perByte(bytes)
    return Number(emissions.toFixed(5))
}

/**
 * @param {string}  url
 * @return {boolean} - true if the url is a valid url
 * @throws {Error} - if the url is not valid
 */
export const validateUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch (error) {
        throw new Error(`Invalid URL: ${url}`)
    }
}

const models = ['swd', '1byte']

/**
 *
 * @param {string} model
 * @returns {boolean}
 *
 * Checks if the model passed in is valid.
 * Valid models are: swd, 1byte
 */
export const checkModel = (model) => {
    if (!models.includes(model)) {
        throw new Error(`Invalid model: "${model}". Valid models are: ${models.toString()}`)
    }
}
