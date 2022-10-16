import { crawlSite } from '../index.js'

/**
 *
 * @param {string} siteUrl
 * @param {string} model
 * @param {Budget} budget
 */

crawlSite({
    siteUrl: 'https://aremythirdpartiesgreen.com/',
    model: 'swd',
    budget: {
        kb: 420,
    },
})
