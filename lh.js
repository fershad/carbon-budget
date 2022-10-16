import fs from 'fs'
import shortHash from 'short-hash'
import lighthouse from 'lighthouse'
import chromeLauncher from 'chrome-launcher'
import desktopConfig from 'lighthouse/lighthouse-core/config/lr-desktop-config.js'

const SECONDS = 1000

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

    // override desktop to allow for looooong load times
    // from the webarchive
    desktopConfig.settings.maxWaitForFcp = 180 * SECONDS
    desktopConfig.settings.maxWaitForLoad = 180 * SECONDS

    const options = { logLevel: 'info', output: 'html', port: chrome.port, onlyCategories: ['performance'] }

    const runnerResult = await lighthouse(url, options, desktopConfig)

    await chrome.kill()
    return runnerResult
}

/**
 * @param  {LighthouseResultObject} runnerResult - a Lighthouse Result object
 * @param  {string} reportName -a string for the path on the file system to use.
 *
 * Take the Lighthouse result and write the human readable HTML report, as well as
 * dumping the JSON representation.
 * We assume `reportName` has been sanitised and is safe to use.
 */
export async function writeLHResult(runnerResult, reportName) {
    const reportHTML = runnerResult.report
    const reportJSON = JSON.stringify(runnerResult.lhr)
    if (!fs.existsSync('./raw')) {
        fs.mkdirSync('./raw')
    }
    fs.writeFileSync(`./raw/${shortHash(reportName)}.html`, reportHTML)
    fs.writeFileSync(`./raw/${shortHash(reportName)}.json`, reportJSON)
}

/**
 * @param  {String} pathToReportJSON - a path to a json file to load and parse
 * @return {object|null} - the parsed report to work with
 */
function loadReport(pathToReportJSON) {
    try {
        const contents = fs.readFileSync(pathToReportJSON)
        const report = JSON.parse(contents)
        return report
    } catch (error) {
        console.error(`no parseable file found at ${pathToReportJSON}`)
    }
}

function loadTransferForPageVariants(pageName) {
    const files = fs.readdirSync('./lh-runs/')
    const matchingRuns = this.lighthouseRunsForName(files, pageName)
    const rows = []

    for (const runFile of matchingRuns) {
        const loadPath = `./lh-runs/${runFile}`

        if (fs.statSync(loadPath)) {
            const result = this.loadReport(loadPath)
            const transfer = this.analyseTransfer(result)
            const variant = runFile.replace(`${pageName}-`, '').replace('.json', '')
            transfer.Name = variant
            rows.push(transfer)
        }
    }
    return rows
}

/**
 * @param  {LighthouseResultObject} lighthouseResult
 *
 * Accept a Lighthouse Result, and pull out the total transfer,
 * broken down by file type.
 *
 */
export function analyseTransfer(lighthouseResult) {
    const { items } = lighthouseResult.audits['resource-summary'].details
    return items
}

/**
 * @param  {string} files - a set of file names from listing the
 * contents of a directory
 * @param  {string} fileName - file name to search for matching runs for
 *
 * Return the matching json files from the list that match the string fileName
 */
function lighthouseRunsForName(files, fileName) {
    return files.filter((file) => file.startsWith(fileName)).filter((file) => file.match('.json'))
}
