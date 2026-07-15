const test = require('node:test');
const assert = require('node:assert/strict');
const { parseBooks } = require('../src/index');

test('parseBooks extracts title, price, and link from product cards', () => {
  const html = `
    <html>
      <body>
        <ol class="row">
          <li class="col-xs-6 col-sm-4 col-md-3 col-lg-3 product_pod">
            <article class="product_pod">
              <h3><a title="A Light in the Attic" href="/catalogue/a-light-in-the-attic_1000/index.html">A Light in the Attic</a></h3>
              <p class="price_color">£51.77</p>
              <a href="/catalogue/a-light-in-the-attic_1000/index.html"></a>
            </article>
          </li>
        </ol>
      </body>
    </html>
  `;

  const books = parseBooks(html);

  assert.equal(books.length, 1);
  assert.equal(books[0].title, 'A Light in the Attic');
  assert.equal(books[0].price, '£51.77');
  assert.match(books[0].link, /a-light-in-the-attic_1000/);
});
