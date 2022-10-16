import Crawler from 'simplecrawler'
import { co2 } from '@tgwf/co2'
import { runLighthouse, writeResults, analyseTransfer } from './lh.js'
import { estimateEmissions } from './utils/co2.js'

const lighthouse = runLighthouse
const urls = []

/**
 *
 * @param { String } contentType
 * @returns { Boolean }
 *
 * Checks if the content type passed in is contains the string "html".
 */
export const isContentTypeHtml = (contentType) => contentType?.toLowerCase().includes('html')

/**
 *
 * @param { String } siteUrl
 * @param { String } model
 * @param { Number } pageBudget
 *
 * Runs the crawler to generate a list of URLs.
 * These are then sequentially run through lighthouse.
 * It might take a while for a large site, so grab a cup of tea.
 */
export const crawl = (siteUrl, model, pageBudget) => {
    const crawler = new Crawler(siteUrl)
    const co2js = new co2({
        model: model || 'swd',
    })

    crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
        const { url } = queueItem
        const contentType = response.headers['content-type']
        if (!isContentTypeHtml(contentType)) return
        const { statusCode } = response
        if (!contentType || !statusCode) return

        urls.push(url)
    })

    crawler.on('complete', async () => {
        const data = []
        for (const url of urls) {
            const result = await lighthouse(url)
            // await writeLHResult(result, url)
            const transfer = analyseTransfer(result.lhr)
            data.push({ url, transfer })
        }

        // Loop through each URL and calculate the emissions for each data type
        const output = []
        for (const { url, transfer } of data) {
            const details = {}

            const total = {
                bytes: transfer.total,
                co2: estimateEmissions(transfer.total, co2js),
            }

            for (const [type, bytes] of Object.entries(transfer)) {
                if (type !== 'total') {
                    details[type] = {
                        bytes,
                        co2: estimateEmissions(bytes, co2js),
                    }
                }
            }

            output.push({ url, total, details })
        }

        console.table(output)
        writeResults(output)
    })

    crawler.start()
}
