import Crawler from 'simplecrawler'
import { co2 } from '@tgwf/co2'
import ora from 'ora'
import { runLighthouse, analyseTransfer } from './lh.js'
import { estimateEmissions, writeResults, isContentTypeHtml } from './utils/index.js'

const lighthouse = runLighthouse
const urls = []

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
    const spinner = ora('Crawling site').start()
    const crawler = new Crawler(siteUrl)
    const co2js = new co2({
        model: model || 'swd',
    })

    // Run the crawl on the website provided
    crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
        const { url } = queueItem
        const contentType = response.headers['content-type']
        if (!isContentTypeHtml(contentType)) return
        const { statusCode } = response
        if (!contentType || !statusCode) return

        // Add all urls that are found and are html to the urls array
        urls.push(url)
    })

    crawler.on('complete', async () => {
        spinner.succeed(`Crawling complete - ${urls.length} URLs found.`)
        console.log('============')
        const data = []
        console.log('Running Lighthouse')

        // Once the crawl is complete, run lighthouse on each url
        for (const url of urls) {
            const lhSpinner = ora(`Running Lighthouse on ${new URL(url).pathname}`).start()
            const result = await lighthouse(url)
            // await writeLHResult(result, url)
            const transfer = analyseTransfer(result.lhr)
            data.push({ url, transfer })
            lhSpinner.succeed()
        }

        const output = []
        const overBudget = []
        console.log('============')
        console.log('Calculating emissions')

        // Loop through each URL and calculate the emissions for each data type based on lighthouse runs
        for (const { url, transfer } of data) {
            const analysisSpinner = ora(`Analysing results for ${new URL(url).pathname}`).start()
            const details = {}

            // Work out the total emissions for the page
            const total = {
                bytes: transfer.total,
                co2: estimateEmissions(transfer.total, co2js),
            }

            // Work out the emissions for each data type
            for (const [type, bytes] of Object.entries(transfer)) {
                if (type !== 'total') {
                    details[type] = {
                        bytes,
                        co2: estimateEmissions(bytes, co2js),
                    }
                }
            }

            output.push({ url, total, details })

            // If there's a pageBudget set, check the page is under budget
            if (pageBudget) {
                if (total.co2 > pageBudget) {
                    const overBudgetBy = total.co2 - pageBudget
                    overBudget.push({ url, co2: total.co2, overBudgetBy })
                }
            }

            analysisSpinner.succeed()
        }

        if (pageBudget) {
            console.log('============')
            console.log(`Page budget: ${pageBudget}gCO2. ${overBudget.length} pages over budget.`)
            console.table(overBudget)
        } else {
            console.table(output)
        }

        writeResults(output, siteUrl, 'all-pages')
        if (overBudget.length > 0) {
            writeResults(overBudget, siteUrl, 'over-budget')
        }
    })

    crawler.start()
}
