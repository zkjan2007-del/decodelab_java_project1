const fetch = require('node-fetch');
const cheerio = require('cheerio');

const BASE_URL = 'https://books.toscrape.com/catalogue';
const REQUEST_DELAY_MS = 1000;
const MAX_PAGES = 5;
const USER_AGENT = 'BookScraperPracticeBot/1.0 (+https://example.com/bot-purpose)';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

function parseBooks(html) {
  const $ = cheerio.load(html);
  const books = [];

  $('li.product_pod').each((_, element) => {
    const title = $(element).find('h3 a').attr('title')?.trim() || '';
    const price = $(element).find('.price_color').text().trim() || '';
    const rawLink = $(element).find('h3 a').attr('href');

    if (!title) {
      return;
    }

    const normalizedLink = rawLink
      ? new URL(rawLink, `${BASE_URL}/`).toString()
      : null;

    books.push({
      title,
      price,
      link: normalizedLink,
    });
  });

  return books;
}

async function scrapeBooks({ maxPages = MAX_PAGES } = {}) {
  const results = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const url = page === 1
      ? `${BASE_URL}/page-1.html`
      : `${BASE_URL}/page-${page}.html`;

    const html = await fetchPage(url);
    const books = parseBooks(html);
    results.push(...books);

    if (page < maxPages) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return results;
}

async function main() {
  try {
    const books = await scrapeBooks();
    console.log(JSON.stringify(books.slice(0, 5), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseBooks,
  scrapeBooks,
};
