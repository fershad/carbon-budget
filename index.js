/**
 * @typedef {{ co2?: number, bytes?: number }} Budget
 * @typedef {{ site: string, model?: string, budget: Budget }} CreateOptions
 */

import { crawl } from './crawl.js'
import { validateUrl, checkModel, calculatePageBudget } from './utils/index.js'

export async function crawlSite(CreateOptions) {
    const { model, budget, siteUrl } = CreateOptions
    validateUrl(siteUrl)

    if (model) {
        checkModel(model)
    }

    let pageBudget = null
    if (budget) {
        pageBudget = calculatePageBudget(budget, model)
    }

    crawl(siteUrl, model, pageBudget)
}
