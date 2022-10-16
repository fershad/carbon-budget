import crawlSite from '../src/index.js'

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
        // co2: 0.16,
        kb: 420,
    },
})
