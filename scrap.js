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

const scrapOffer = async ({ url, title }, retriesLeft) => {
  console.log(`scrap Offer - url: ${url} leftAttempts: ${retriesLeft}`);

  try {
    const redData = await goToOfferPageAndScrap({ url, title });
    console.log("redData", redData);
    return redData;
  } catch (error) {
    if (retriesLeft > 0) {
      return scrapOffer({ url, title }, retriesLeft - 1);
    } else {
      return Promise.reject();
    }
  }
};

const goToOfferPageAndScrap = async ({ url, title }) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });

    let page = await browser.newPage();

    const userAgent = returnRandomUserAgent();
    page.setUserAgent(userAgent);

    console.log("opening url:", url);
    await page.goto(url);

    const titleN = await page.evaluate(
      () => document.querySelector(".offer-titlebox h1").innerText
    );

    const offerID = await page.evaluate(() =>
      document
        .querySelector(".offer-titlebox__details em small")
        .innerText.replace("ID ogłoszenia: ", "")
    );

    // await page.screenshot({ path: `e-${title}-${offerID}.png` }).catch(err => {
    //   console.error("error in creating screenshot", url);
    // });

    console.log(titleN, offerID);

    // const waitingTime = 500 + Math.floor(Math.random() * 1000);
    // await page.waitFor(0);
    await browser.close();

    // REFACTOR THIS
    if (offerID) {
      return Promise.resolve(offerID);
    } else {
      return Promise.resolve(new Error("Can not scrap offer data"));
    }
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    return Promise.reject(error);
  }
};

(async () => {
  // let browser = await puppeteer.launch({ headless: true });
  // const page = await browser.newPage();
  // page.setUserAgent(
  //   "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"
  // );

  // const allOffersList = await goToListPageAndScrapRecursively(
  //   "https://www.olx.pl/nieruchomosci/mieszkania/wynajem/olawa/",
  //   page
  // );

  // console.log(`all found offers (${allOffersList.length})`, allOffersList);
  // const filteredOnlyOlx = allOffersList
  //   .filter(el => el.url.includes("www.olx.pl"))
  //   .slice(0, 3);

  // console.log("filtered:", filteredOnlyOlx);

  // console.log("wait");
  // await page.waitFor(1000);
  // console.log("wait end");
  // await browser.close();

  const filteredOnlyOlx = [
    {
      title: "4 pokoje Oława Chopina",
      url:
        "https://www.olx.pl/oferta/4-pokoje-olawa-chopina-CID3-IDC1D2R.html#7ad347de0f"
    },
    {
      title: "Mieszkanie do wynajęcia od zaraz. квартира негайно",
      url:
        "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-od-zaraz-CID3-IDBfnfd.html#7ad347de0f"
    },
    {
      title: "XXX",
      url:
        "https://www.kultura.olawa.pl/oferta/mieszkanie-do-wynajecia-od-zaraz-CID3-XXXXX.html#7ad347de0f"
    },
    {
      title: "Mieszkanie do wynajęcia",
      url:
        "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-CID3-IDCswau.html#7ad347de0f"
    }
  ];

  for (const x of filteredOnlyOlx) {
    await scrapOffer(x, 2).catch(() => {
      console.log("nie da się pobrać");
    });
    // await goToOfferPageAndScrap(x).catch(error => {
    //   console.log("nie da się pobrać", error.message);
    // });
    console.log("----------------------------------------------------");
  }
})();
