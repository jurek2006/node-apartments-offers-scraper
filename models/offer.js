const { readJsonFile, saveJsonFile } = require('../utils/fileSystemUtils');
const { OFFERS_FILE } = require('../config/config');
const puppeteer = require('puppeteer');
const utils = require('../app/utils');

module.exports = class Offer {
  constructor(url, details = {}) {
    this.url = url;
    this.details = details;
  }

  // method saving offer to json file
  async save() {
    const offerToSave = this;

    // read all offers from file to array
    const allRedOffers = await Offer.readAll();
    if (!allRedOffers.ok) return allRedOffers;

    // check if there's no offer with same url
    const existingOffer = allRedOffers.data.find(
      offer => offer.url === offerToSave.url
    );
    if (existingOffer) {
      return {
        ok: false,
        error: `offer with url ${offerToSave.url} already saved`
      };
    }

    // if there's no offer with same url add saving offer
    const updatedAllOffers = [offerToSave, ...allRedOffers.data];

    // save all offers to the file and return saved offer
    const savingStatus = await Offer.saveAll(updatedAllOffers);

    // if Offer.saveAll failed return {ok: false, error}
    if (!savingStatus.ok) return savingStatus;

    return { ok: true, data: offerToSave }; // if saving succeeded - return with data of saved offer
  }

  // reads all offers from json file
  static async readAll() {
    try {
      const redData = await readJsonFile(
        OFFERS_FILE.filename,
        OFFERS_FILE.path
      );
      if (!redData.ok) return redData;

      if (!Array.isArray(redData.data)) {
        return {
          ok: false,
          error: new Error('redData.data is not an array')
        };
      }
      return {
        ok: true,
        data: redData.data.map(
          redDataitem => new Offer(redDataitem.url, redDataitem.details)
        )
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  // saves array of Offer instances to json file
  static async saveAll(offersArray) {
    // saveJsonFile returns promise which resolves to {ok: true} when succeed and {ok: false, error} when failed
    return await saveJsonFile(
      offersArray,
      OFFERS_FILE.filename,
      OFFERS_FILE.path
    );
  }

  // gets Offer with given url from json file
  static async getByUrl(url) {
    const allOffersRedResult = await Offer.readAll();
    if (!allOffersRedResult.ok) return allOffersRedResult;

    try {
      const foundOfferData = allOffersRedResult.data.find(
        offer => offer.url === url
      );
      return { ok: true, data: foundOfferData };
    } catch (error) {
      return { ok: false, error };
    }
  }

  returnRandomUserAgent() {
    const userAgents = [
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92',
      'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/70.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/70.0',
      'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/70.0'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  async scrapFromPage() {
    // tries scraping from url - returns promise
    // resolves to succes or rejects if scraping failed

    const { url } = this;
    console.log('scrap method', this, url);

    let browser;
    try {
      browser = await puppeteer.launch({ headless: true });

      let page = await browser.newPage();

      const userAgent = this.returnRandomUserAgent();
      console.log('userAgent', userAgent);
      page.setUserAgent(userAgent);

      console.log('opening url:', url);
      await page.goto(url);

      let details = {};

      // details.title = title;
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
          .evaluate(
            () => document.querySelector('.price-label strong').innerText
          )
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
      details.priceWithRent =
        details.price + detailsTable['Czynsz (dodatkowo)'];

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

      if (offerID) {
        // if scraped properly - there's the offerID
        return { ok: true, data: new Offer(url, details) };
      } else {
        return { ok: false, error: 'Can not scrap offer data' };
      }
    } catch (error) {
      if (browser) {
        // if browser still opened - close it
        await browser.close();
      }
      return { ok: false, error };
    }
  }

  async scrapAttemptWithRetry(retriesLeft) {
    console.log(
      '------------------------------------------------------------------'
    );
    console.log(`scrap Offer - url: ${this.url} leftAttempts: ${retriesLeft}`);

    const scrapingResult = await this.scrapFromPage();
    if (!scrapingResult.ok) {
      if (retriesLeft > 0) {
        return this.scrapAttemptWithRetry(retriesLeft - 1);
      } else {
        return {
          ok: false,
          error: `Failed scraping url ${this.url}`
        };
      }
    }
    return { ok: true, data: scrapingResult.data };
  }

  async scrapIfNewOfferAndSave() {
    const offerToScrap = this;

    // checking if offer already scraped and omiting if so
    const checkIfAlreadyScraped = await Offer.getByUrl(offerToScrap.url);
    if (!checkIfAlreadyScraped.ok) {
      console.error(
        `Failed to check if offer with url ${offerToScrap.url} already scraped. Carry on scraping the offer`,
        checkIfAlreadyScraped.error
      );
    }

    if (checkIfAlreadyScraped.data) {
      // found offer data in saved/already scraped offers
      console.log(
        `Offer with url ${offerToScrap.url} already scraped/saved. Offer omited.`
      );
      return { ok: true, data: undefined };
    }

    const scrapingOfferResult = await offerToScrap.scrapAttemptWithRetry(2);
    if (!scrapingOfferResult.ok) {
      const error = `Failed scraping url' ${scrapingOfferResult.error}`;
      console.error(error);
      return {
        ok: false,
        error
      };
    }

    // if offer scraped properly scrapedOffer contains property details with properties like rooms, ares etc.
    const scrapedOffer = scrapingOfferResult.data;

    if (scrapedOffer) {
      console.log('scrapedOffer', scrapedOffer);

      const savingStatus = await scrapedOffer.save();
      if (!savingStatus.ok) {
        const error = `Saving offer failed for offer with url ${scrapedOffer.url} - ${savingStatus.error}`;
        console.error(error);
        return {
          ok: false,
          error
        };
      }

      console.log(
        `Saving offer succeed for offer with url ${scrapedOffer.url}`
      );
      return {
        ok: true,
        data: scrapedOffer
      };
    }
  }

  // method to scrap offers for each url in urlsArray
  static async scrapAll(urlsArray) {
    for (const offerUrl of urlsArray) {
      await new Offer(offerUrl).scrapIfNewOfferAndSave();
    }
  }
};
