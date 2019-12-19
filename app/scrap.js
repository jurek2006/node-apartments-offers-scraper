const puppeteer = require('puppeteer');
const utils = require('./utils');
const { OFFERS_FILE } = require('../config/config');
const { readJsonFile } = require('../utils/fileSystemUtils');
const gSheets = require('./gsheets');
const Offer = require('../models/offer');
const ApartmentRentOffer = require('../models/apartmentRentOffer');

const returnRandomUserAgent = () =>
  userAgents[Math.floor(Math.random() * userAgents.length)];

const scrapOffersList = async page => {
  // get offers' list:
  const offersList = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        'table.offers:not(.offers--top) a.detailsLink:not(.thumb), table.offers:not(.offers--top) a.detailsLinkPromoted:not(.thumb)'
      )
    ).map(offer => ({ title: offer.innerText, url: offer.href }))
  );
  console.log(`found ${offersList.length} offers`);
  return offersList;
};

const goToListPageAndScrapRecursively = async (url, page) => {
  console.log('opening url:', url);
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

    console.log('opening url:', url);
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
        .querySelector('.offer-titlebox__details em small')
        .innerText.replace('ID ogłoszenia: ', '')
    );
    details.offerID = offerID;

    // price;
    details.price = utils.convertDataToNumber(
      await page
        .evaluate(() => document.querySelector('.price-label strong').innerText)
        .catch(err => {
          console.log('price problem', err);
        })
    );

    // get details from table
    const detailsTable = await page.evaluate(() => {
      const details = {};
      Array.from(document.querySelectorAll('.details tr tr')).forEach(el => {
        details[el.querySelector('th').innerText] = el.querySelector(
          'td'
        ).innerText;
        // .replace(/,/g, "."); //replace , with .
      });
      return details;
    });

    // convert rent
    detailsTable['Czynsz (dodatkowo)'] = utils.convertDataToNumber(
      detailsTable['Czynsz (dodatkowo)']
    );

    // convert area
    // REFACTOR CONVERTING
    detailsTable.Powierzchnia = utils.convertNumberToStringWithDecimalSeparator(
      utils.convertDataToNumber(detailsTable.Powierzchnia),
      ','
    );

    // // add price with rent
    details.priceWithRent = details.price + detailsTable['Czynsz (dodatkowo)'];

    // add properties from detailsTable to details
    // details = Object.assign(details, detailsTable);
    details.rent = detailsTable['Czynsz (dodatkowo)'];
    details.area = detailsTable.Powierzchnia;
    details.rooms = detailsTable['Liczba pokoi'];
    details.furniture = detailsTable.Umeblowane;
    details.floor = detailsTable.Poziom;
    details.building = detailsTable['Rodzaj zabudowy'];
    details.offerType = detailsTable['Oferta od'];

    // user
    details.userName = await page.evaluate(
      () => document.querySelector('.offer-user__details h4').innerText
    );

    details.userLink = await page.evaluate(
      () => document.querySelector('.offer-user__details h4 a').href
    );

    // added date & time

    const offerAdded = utils.getTimeAndDate(
      await page.evaluate(
        () => document.querySelector('.offer-titlebox__details em').innerText
      )
    );

    details.addedDate = offerAdded.date;
    details.addedTime = offerAdded.time;

    await browser.close();

    // REFACTOR THIS
    if (offerID) {
      return Promise.resolve(details);
    } else {
      return Promise.reject(new Error('Can not scrap offer data'));
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
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0'
  );

  const allOffersList = await goToListPageAndScrapRecursively(
    'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/olawa/',
    page
  );

  if (browser) {
    // if browser still opened - close it
    await browser.close();
  }

  console.log(`all found offers (${allOffersList.length})`, allOffersList);
  const filteredOnlyOlx = allOffersList
    .filter(el => el.url.includes('www.olx.pl'))
    .map(el => el.url);
  //   .slice(0, 3);

  // console.log('filtered:', filteredOnlyOlx);

  // TESTING
  // const filteredOnlyOlx = [
  //   {
  //     title: 'Wynajmę mieszkanie Zaciszna',
  //     url:
  //       'https://www.olx.pl/oferta/wynajme-mieszkanie-zaciszna-CID3-IDCp7HU.html#7ad347de0f'
  //   },
  //   {
  //     title: 'Wynajmę mieszkanie w Oławie 55m2',
  //     url:
  //       'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-55m2-CID3-IDCIeb7.html#7ad347de0f'
  //   },
  //   {
  //     title: 'Wynajmę mieszkanie w Oławie !!!',
  //     url:
  //       'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-CID3-IDAFMGG.html#7ad347de0f'
  //   }
  // ];

  // const allResults = [];
  // for (const offerDetailsLink of filteredOnlyOlx) {
  //   // const redOfferData = await scrapOffer(offerDetailsLink, 2).catch(() => {
  //   //   console.log("Can't scrap offer's details");
  //   // });
  //   // console.log("red offer data", redOfferData);
  //   // allResults.push(new Offer(redOfferData));
  //   console.log('offerDetailsLink', offerDetailsLink);
  //   const details = await new ApartmentRentOffer(
  //     offerDetailsLink
  //   ).goToOfferPageAndScrap();
  //   console.log('details', details);
  //   console.log('----------------------------------------------------');
  // }

  // await utils.saveJsonFile(
  //   `./output/result-${utils.getTimeStamp()}.json`,
  //   allResults
  // );
  // await utils.saveCsvFile(
  //   `./output/result-${utils.getTimeStamp()}.csv`,
  //   allResults
  // );

  await Offer.scrapAll(filteredOnlyOlx);

  // read saved offers
  const redJsonResult = await readJsonFile(
    OFFERS_FILE.filename,
    OFFERS_FILE.path
  );
  if (!redJsonResult.ok) {
    console.log('Cant read data');
    return;
  }

  // when data red properly
  const allResults = redJsonResult.data.map(item => item.details);
  console.log('allResults', allResults);

  await gSheets.clearGoogleSheets().catch(err => console.log('błąd GS', err));

  await gSheets
    .saveToGoogleSheets(
      utils.convertCsvToArray(utils.convertDataToCsv(allResults))
    )
    .catch(err => console.log('błąd GS', err));

  await gSheets.formatInGoogleSheets();
  // await gSheets.sortInGoogleSheets().catch(err => console.log('błąd GS', err));

  // console.log('All results:', allResults);
  // Offer.saveAll(allResults);
  // // const found = await Offer.readAll();
  // const found = await ApartmentRentOffer.readAll();

  // console.log('found', found);
})();
