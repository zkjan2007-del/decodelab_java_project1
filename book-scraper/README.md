# Book Scraper

A simple practice scraper for books.toscrape.com that follows a fetch → parse → extract → clean → structure workflow.

## Project note
This project demonstrates a basic web scraping pipeline in Node.js. It fetches product pages, parses the HTML with Cheerio, extracts book details such as title, price, and product link, and returns the data in a structured format.

## Features
- Respects polite scraping behavior with a descriptive User-Agent and a 1-second delay between requests.
- Limits runs to 5 pages for short practice sessions.
- Extracts title, price, and product link from each book card.

## Run
```bash
npm install
npm start
```

## Test
```bash
npm test
```
