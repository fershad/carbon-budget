import Crawler from 'simplecrawler';


const urls = [];

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
    console.log('urlFound', url, contentType, responseBuffer.length, statusCode)
    urls.push(url);
  });

  crawler.on('complete', () => urls);

  crawler.start();
};