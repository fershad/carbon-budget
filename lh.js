import lighthouse from 'lighthouse'
import chromeLauncher from 'chrome-launcher'
import desktopConfig from 'lighthouse/lighthouse-core/config/lr-desktop-config.js'

/**
 * @param  {URL} url
 * @return {object} - the lighthouse results
 *
 * Accept an url, and use chrome to run a Lighthouse against the given url
 * using a slightly modified desktop config. With this config, we account
 * for very slow pages, to make it possible to check a url against the
 * Web Archive.
 */
export async function runLighthouse(url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
    const options = { output: 'json', port: chrome.port, onlyCategories: ['performance'] }

    const runnerResult = await lighthouse(url, options, desktopConfig)

    await chrome.kill()
    return runnerResult
}

/**
 * @param  {LighthouseResultObject} runnerResult - a Lighthouse Result object
 * @param  {string} reportName -a string for the path on the file system to use.
 *
 * Take the Lighthouse result and write a JSON representation.
 * The report name is sanitised using the pathname.
 */
// export async function writeLHResult(runnerResult, reportName) {
//     // const reportHTML = runnerResult.report
//     const reportJSON = JSON.stringify(runnerResult.lhr)
//     if (!fs.existsSync('./raw')) {
//         fs.mkdirSync('./raw')
//     }
//     // fs.writeFileSync(`./raw/${shortHash(reportName)}.html`, reportHTML)
//     fs.writeFileSync(`./raw/${sanitiseUrlPath(reportName)}.json`, reportJSON)
// }

/**
 * @param  {LighthouseResultObject} lighthouseResult
 *
 * Accept a Lighthouse Result, and pull out the total transfer,
 * broken down by file type.
 *
 */
export function analyseTransfer(lighthouseResult) {
    const { items } = lighthouseResult.audits['resource-summary'].details
    const transfer = items.reduce((acc, item) => {
        acc[item.resourceType] = item.transferSize
        return acc
    }, {})

    return transfer
}
