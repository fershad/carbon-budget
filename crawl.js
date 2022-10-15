import Crawler from 'simplecrawler';
import { runLighthouse, writeLHResult } from './lh.js';

const lighthouse = runLighthouse
const urls = []

export const isContentTypeHtml = (contentType) => {
    return contentType?.toLowerCase().includes('html');
  };

export const crawl = (siteUrl) => {
  const crawler = new Crawler(siteUrl);

  crawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
    const url = queueItem.url;
    const contentType = response.headers['content-type'];
    if (!isContentTypeHtml(contentType)) return;
    const statusCode = response.statusCode;
    if (!contentType || !statusCode) return;

    urls.push(
      url
    );
  });

  crawler.on('complete', async () => {
    console.log(urls);
    for (const url of urls) {
      const result = await lighthouse(url);
      await writeLHResult(result, url);
    }
  });

  crawler.start();
};