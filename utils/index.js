import { co2 as tgwf } from '@tgwf/co2'
import fs from 'fs'

/**
 *
 * @param {string} value
 *
 * Slugifies the string provided to be used for file/folder names.
 */
export const slugify = (value) => {
    // slugify the pathname, replacing all special characters with a dash
    const slug = value.replace(/[^a-zA-Z0-9]/g, '-')
    // remove any double dashes, leading and trailing dashes
    const cleanSlug = slug.replace(/--/g, '-').replace(/^-|-$/g, '')

    return cleanSlug.length > 0 ? cleanSlug : 'index'
}

/**
 * @param {number} bytes
 * @returns {number} - the number of grams of CO2 emitted
 *
 * Takes the number of bytes and returns the number of grams of CO2 emitted.
 * For more information on the calculation, see https://developers.thegreenwebfoundation.org/co2js/methods/#perbyte
 */
export const estimateEmissions = (bytes, co2js) => {
    const emissions = co2js.perByte(bytes)
    return Number(emissions.toFixed(5))
}

/**
 * @param {string}  url
 * @return {boolean} - true if the url is a valid url
 * @throws {Error} - if the url is not valid
 *
 * Takes the url and checks if it is a valid url.
 */
export const validateUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch (error) {
        throw new Error(`Invalid URL: ${url}`)
    }
}

/**
 *
 * @param {string} model
 * @returns {boolean}
 *
 * Checks if the model passed in is valid.
 * Valid models are: swd, 1byte
 */
export const checkModel = (model) => {
    const models = ['swd', '1byte']
    if (!models.includes(model)) {
        throw new Error(`Invalid model: "${model}". Valid models are: ${models.toString()}`)
    }
}

/**
 * @param {Budget} budget
 * @returns {number} - grams of CO2e to be used as a page budget
 */
export const calculatePageBudget = (budget, model) => {
    const { co2, kb } = budget
    let pageBudget
    if (co2 && kb) {
        console.warn('⚠️  Both co2 and kilobyte budgets were decalred. Using co2 budget.')
        pageBudget = co2
    } else if (kb) {
        const bytes = kb * 1000
        const co2js = new tgwf({
            model: model || 'swd',
        })
        pageBudget = co2js.perByte(bytes)
        console.warn(`ℹ️  Setting a page budget of ${pageBudget.toFixed(5)}g CO2e based on ${kb}kb.`)
    } else {
        pageBudget = co2
    }

    return Number(pageBudget.toFixed(5))
}

/**
 *
 * @param { String } contentType
 * @returns { Boolean }
 *
 * Checks if the content type passed in is contains the string "html".
 */
export const isContentTypeHtml = (contentType) => contentType?.toLowerCase().includes('html')

/**
 * @param {object} lhr - a Lighthouse Result object
 * @param {string} url
 * @param {string} resultType
 *
 * Writes the results of the data transfer/co2 calculations to a file.
 */
export async function writeResults(lhr, url, resultType) {
    const reportJSON = JSON.stringify(lhr)
    const slug = slugify(url)
    const timestamp = Date.now()
    if (!fs.existsSync(`./results/${slug}-${timestamp}`)) {
        fs.mkdirSync(`./results/${slug}-${timestamp}`)
    }
    fs.writeFileSync(`./results/${slug}-${timestamp}/${resultType}.json`, reportJSON)
}
