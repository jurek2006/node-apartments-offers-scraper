const puppeteer = require("puppeteer");
const utils = require("./utils");
const gSheets = require("./gsheets");

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
        "table.offers:not(.offers--top) a.detailsLink:not(.thumb), table.offers:not(.offers--top) a.detailsLinkPromoted:not(.thumb)"
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
    return await goToOfferPageAndScrap({ url, title });
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
    browser = await puppeteer.launch({ headless: true });

    let page = await browser.newPage();

    const userAgent = returnRandomUserAgent();
    page.setUserAgent(userAgent);

    console.log("opening url:", url);
    await page.goto(url);

    let details = {};

    // add checking if titles match
    // const titleN = await page.evaluate(
    //   () => document.querySelector(".offer-titlebox h1").innerText
    // );

    details.title = title;
    details.url = url;

    const offerID = await page.evaluate(() =>
      document
        .querySelector(".offer-titlebox__details em small")
        .innerText.replace("ID ogłoszenia: ", "")
    );
    details.offerID = offerID;

    // price;
    details.price = utils.convertDataToNumber(
      await page
        .evaluate(() => document.querySelector(".price-label strong").innerText)
        .catch(err => {
          console.log("price problem", err);
        })
    );

    // get details from table
    const detailsTable = await page.evaluate(() => {
      const details = {};
      Array.from(document.querySelectorAll(".details tr tr")).forEach(el => {
        details[el.querySelector("th").innerText] = el.querySelector(
          "td"
        ).innerText;
        // .replace(/,/g, "."); //replace , with .
      });
      return details;
    });

    // convert rent
    detailsTable["Czynsz (dodatkowo)"] = utils.convertDataToNumber(
      detailsTable["Czynsz (dodatkowo)"]
    );

    // convert area
    // REFACTOR CONVERTING
    detailsTable.Powierzchnia = utils.convertNumberToStringWithDecimalSeparator(
      utils.convertDataToNumber(detailsTable.Powierzchnia),
      ","
    );

    // // add price with rent
    details.priceWithRent = details.price + detailsTable["Czynsz (dodatkowo)"];

    // add properties from detailsTable to details
    // details = Object.assign(details, detailsTable);
    details.rent = detailsTable["Czynsz (dodatkowo)"];
    details.area = detailsTable.Powierzchnia;
    details.rooms = detailsTable["Liczba pokoi"];
    details.furniture = detailsTable.Umeblowane;
    details.floor = detailsTable.Poziom;
    details.building = detailsTable["Rodzaj zabudowy"];
    details.offerType = detailsTable["Oferta od"];

    // user
    details.userName = await page.evaluate(
      () => document.querySelector(".offer-user__details h4").innerText
    );

    details.userLink = await page.evaluate(
      () => document.querySelector(".offer-user__details h4 a").href
    );

    // added date & time

    const offerAdded = utils.getTimeAndDate(
      await page.evaluate(
        () => document.querySelector(".offer-titlebox__details em").innerText
      )
    );

    details.addedDate = offerAdded.date;
    details.addedTime = offerAdded.time;

    await browser.close();

    // REFACTOR THIS
    if (offerID) {
      return Promise.resolve(details);
    } else {
      return Promise.reject(new Error("Can not scrap offer data"));
    }
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    return Promise.reject(error);
  }
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
  const filteredOnlyOlx = allOffersList
    .filter(el => el.url.includes("www.olx.pl"))
    .slice(0, 3);

  console.log("filtered:", filteredOnlyOlx);

  console.log("wait");
  await page.waitFor(1000);
  console.log("wait end");
  await browser.close();

  // const filteredOnlyOlx = [
  //   // {
  //   //   title: "4 pokoje Oława Chopina",
  //   //   url:
  //   //     "https://www.olx.pl/oferta/4-pokoje-olawa-chopina-CID3-IDC1D2R.html#7ad347de0f"
  //   // },
  //   // {
  //   //   title: "Mieszkanie do wynajęcia od zaraz. квартира негайно",
  //   //   url:
  //   //     "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-od-zaraz-CID3-IDBfnfd.html#7ad347de0f"
  //   // },
  //   // {
  //   //   title: "XXX",
  //   //   url:
  //   //     "https://www.kultura.olawa.pl/oferta/mieszkanie-do-wynajecia-od-zaraz-CID3-XXXXX.html#7ad347de0f"
  //   // },
  //   // {
  //   //   title: "Mieszkanie do wynajęcia",
  //   //   url:
  //   //     "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-CID3-IDCswau.html#7ad347de0f"
  //   // }
  // ];

  const allResults = [];
  for (const offerDetailsLink of filteredOnlyOlx) {
    const redOfferData = await scrapOffer(offerDetailsLink, 2).catch(() => {
      console.log("Can't scrap offer's details");
    });
    console.log("red offer data", redOfferData);
    allResults.push(redOfferData);
    // await goToOfferPageAndScrap(offerDetailsLink).catch(error => {
    //   console.log("nie da się pobrać", error.message);
    // });
    console.log("----------------------------------------------------");
  }

  await utils.saveJsonFile(
    `./output/result-${utils.getTimeStamp()}.json`,
    allResults
  );
  await utils.saveCsvFile(
    `./output/result-${utils.getTimeStamp()}.csv`,
    allResults
  );

  await gSheets
    .saveToGoogleSheets(
      utils.convertCsvToArray(utils.convertDataToCsv(allResults))
    )
    .catch(err => console.log("błąd GS", err));

  console.log("All results:", allResults);
})();
