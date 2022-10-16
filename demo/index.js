import { crawlSite } from '../index.js'

/**
 *
 * @param {string} siteUrl
 * @param {string} model
 * @param {number} pageBudget
 */

crawlSite({
    siteUrl: 'https://aremythirdpartiesgreen.com/',
    model: 'swd',
    pageBudget: 0.15,
})
