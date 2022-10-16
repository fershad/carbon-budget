import Crawler from 'simplecrawler'
import { runLighthouse, writeLHResult, analyseTransfer } from './lh.js'

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
 *
 * Runs the crawler to generate a list of URLs.
 * These are then sequentially run through lighthouse.
 */
export const crawl = (siteUrl) => {
    const crawler = new Crawler(siteUrl)

    crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
        const { url } = queueItem
        const contentType = response.headers['content-type']
        if (!isContentTypeHtml(contentType)) return
        const { statusCode } = response
        if (!contentType || !statusCode) return

        urls.push(url)
    })

    crawler.on('complete', async () => {
        console.log(urls)
        for (const url of urls) {
            const result = await lighthouse(url)
            await writeLHResult(result, url)
            const transfer = analyseTransfer(result.lhr)
            console.log(transfer)
        }
    })

    crawler.start()
}
