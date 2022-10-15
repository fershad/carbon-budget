import { crawl } from './crawl.js';

async function crawlSite() {
    const crawlEmitter = crawl('http://localhost:8080');
}

crawlSite();