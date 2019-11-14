const puppeteer = require("puppeteer");

const scrapOffersList = async page => {
  // get offers' list:
  const offersList = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "table.offers:not(.offers--top) a.detailsLink:not(.thumb)"
      )
    ).map(offer => ({ title: offer.innerText, href: offer.href }))
  );
  console.log(`found ${offersList.length} offers`);
  return offersList;
};

const goToPageAndScrapRecursively = async (url, page) => {
  console.log("opening url:", url);
  await page.goto(url);

  const offersList = await scrapOffersList(page);

  const nextPage = await page.evaluate(() => {
    const nextPageLinkElement = document.querySelector(
      'a[data-cy="page-link-next"]'
    );
    if (!nextPageLinkElement) {
      return null;
    }
    return nextPageLinkElement.href;
  });

  if (nextPage) {
    return offersList.concat(await goToPageAndScrapRecursively(nextPage, page));
  } else {
    return offersList;
  }
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
  );

  const allOffersList = await goToPageAndScrapRecursively(
    "https://www.olx.pl/nieruchomosci/mieszkania/wynajem/olawa/",
    page
  );

  console.log(`all found offers (${allOffersList.length})`, allOffersList);

  await browser.close();
})();
