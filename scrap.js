const puppeteer = require("puppeteer");

const scrapOffersList = async page => {
  // get offers' list:
  const offers = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "table.offers:not(.offers--top) a.detailsLink:not(.thumb)"
      )
    ).map(offer => ({ title: offer.innerText, href: offer.href }))
  );
  console.log(offers);
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
  );
  await page.goto("https://www.olx.pl/nieruchomosci/mieszkania/wynajem/olawa/");
  console.log("pierwsza strona");
  // await page.screenshot({ path: "example1.png" });

  await scrapOffersList(page);

  const nextPage = await page.evaluate(
    () => document.querySelector('a[data-cy="page-link-next"]').href
  );

  console.log("go to: ", nextPage);

  await page.goto(nextPage);
  console.log("druga strona");
  // await page.screenshot({ path: "example2.png" });
  await scrapOffersList(page);
  await browser.close();
})();
