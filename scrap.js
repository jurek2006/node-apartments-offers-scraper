const puppeteer = require("puppeteer");

const userAgents = [
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/70.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/70.0",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/70.0"
];
const returnRandomUserAgent = () =>
  userAgents[Math.floor(Math.random() * userAgents.length)];

const scrapOffersList = async page => {
  // get offers' list:
  const offersList = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "table.offers:not(.offers--top) a.detailsLink:not(.thumb)"
      )
    ).map(offer => ({ title: offer.innerText, url: offer.href }))
  );
  console.log(`found ${offersList.length} offers`);
  return offersList;
};

const goToListPageAndScrapRecursively = async (url, page) => {
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
    return offersList.concat(
      await goToListPageAndScrapRecursively(nextPage, page)
    );
  } else {
    return offersList;
  }
};

const goToOfferPageAndScrap = async ({ url, title }) => {
  browser = await puppeteer.launch({ headless: true });

  let page = await browser.newPage().catch(err => {
    console.error("error in creating new page");
  });
  const userAgent = returnRandomUserAgent();
  page.setUserAgent(userAgent);

  console.log("opening url:", url);
  await page.goto(url).catch(err => {
    console.error("error in going to url screenshot", url);
  });

  const titleN = await page
    .evaluate(() => document.querySelector(".offer-titlebox h1").innerText)
    .catch(err => {
      console.error("error in getting innerText");
    });

  const offerID = await page
    .evaluate(() =>
      document
        .querySelector(".offer-titlebox__details em small")
        .innerText.replace("ID ogłoszenia: ", "")
    )
    .catch(err => {
      console.error("error in getting id");
    });

  await page.screenshot({ path: `e-${title}-${offerID}.png` }).catch(err => {
    console.error("error in creating screenshot", url);
  });

  console.log(titleN, offerID);

  const waitingTime = 500 + Math.floor(Math.random() * 1000);
  await page.waitFor(waitingTime);
  await browser.close();
};

(async () => {
  let browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setUserAgent(
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
  );

  const allOffersList = await goToListPageAndScrapRecursively(
    "https://www.olx.pl/nieruchomosci/mieszkania/wynajem/olawa/",
    page
  );

  console.log(`all found offers (${allOffersList.length})`, allOffersList);
  const filteredOnlyOlx = allOffersList.filter(el =>
    el.url.includes("www.olx.pl")
  );

  console.log("filtered:", filteredOnlyOlx);

  console.log("wait");
  await page.waitFor(1000);
  console.log("wait end");
  await browser.close();

  // await goToOfferPageAndScrap(filteredOnlyOlx[0]);
  // await goToOfferPageAndScrap(filteredOnlyOlx[1]);
  // await goToOfferPageAndScrap(filteredOnlyOlx[2]);
  // await goToOfferPageAndScrap(filteredOnlyOlx[3]);

  for (const x of filteredOnlyOlx) {
    await goToOfferPageAndScrap(x);
  }

  // filteredOnlyOlx.forEach(async el => await goToOfferPageAndScrap(el)); - NOT WORKING

  // await goToOfferPageAndScrap({
  //   title: "Wynajmę mieszkanie dla firmy lub osób prywatnych",
  //   url:
  //     "https://www.olx.pl/oferta/wynajme-mieszkanie-dla-firmy-lub-osob-prywatnych-CID3-IDBtQ3N.html#0c1750f118"
  // });
  // await goToOfferPageAndScrap({
  //   title: "Mieszkanie",
  //   url: "https://www.olx.pl/oferta/mieszkanie-CID3-IDCa3L7.html#0c1750f118"
  // });
  // await goToOfferPageAndScrap({
  //   title: "Wynajmę duże mieszkanie (3 pokoje) ok 70m2 PARTER",
  //   url:
  //     "https://www.olx.pl/oferta/wynajme-duze-mieszkanie-3-pokoje-ok-70m2-parter-CID3-IDCgLA4.html#7ad347de0f"
  // });
})();
