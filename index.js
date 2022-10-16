/**
 * @typedef {{ site: string, model?: string, pageBudget?: number }} CreateOptions
 */

import { crawl } from './crawl.js'
import { validateUrl, checkModel } from './utils/index.js'

export async function crawlSite(CreateOptions) {
    const { model, pageBudget, siteUrl } = CreateOptions
    validateUrl(siteUrl)

    if (model) {
        checkModel(model)
    }

    crawl(siteUrl, model, pageBudget)
}
