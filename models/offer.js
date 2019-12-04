// const { readJsonFile, saveJsonFile } = require('../utils/fileSystemUtils');
// const { OFFERS_FILE } = require('../config/config');
const puppeteer = require('puppeteer');
const utils = require('../app/utils');

module.exports = class Offer {
  constructor(url, details = {}) {
    this.url = url;
    this.details = details;
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

      // REFACTOR THIS
      if (offerID) {
        // return new Offer instance with details scraped from website
        return Promise.resolve(new Offer(url, details));
      } else {
        return Promise.reject(new Error('Can not scrap offer data'));
      }
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      return Promise.reject(error);
    }
  }

  async scrapAttemptWithRetry(retriesLeft) {
    console.log(`scrap Offer - url: ${this.url} leftAttempts: ${retriesLeft}`);

    try {
      return await this.scrapFromPage();
    } catch (error) {
      if (retriesLeft > 0) {
        return this.scrapAttemptWithRetry(retriesLeft - 1);
      } else {
        return Promise.reject(new Error(`Failed scraping url ${this.url}`));
      }
    }
  }

  static async scrapAll(urlsArray) {
    // method to scrap offers for each url in urlsArray

    for (const offerUrl of urlsArray) {
      const offer = new Offer(offerUrl);
      const scrapedOffer = await offer
        .scrapAttemptWithRetry(2)
        .catch(errorWhenScrapingOffer => {
          console.log('error', errorWhenScrapingOffer);
        });
      if (scrapedOffer) {
        // if offer scraped properly scrapedOffer contains property details with properties like rooms, ares etc.
        console.log('scrapedOffer', scrapedOffer);
      }
    }
  }
};

// -----------------------------------------------------------------------

//   save() {
//     // add saving of offer instance
//     console.log('saving data instance', this);
//   }

//   update() {
//     const offerToUpdate = this;
//     console.log(`update offer with url ${offerToUpdate.url}`);
//     // const allContacts = await readAll();
//   }

//   static saveAll(offersArray) {
//     // returns promise which resolves to true if saving succeed
//     return saveJsonFile(offersArray, OFFERS_FILE.filename, OFFERS_FILE.path);
//   }

//   static async readAll() {
//     const redData = await readJsonFile(OFFERS_FILE.filename, OFFERS_FILE.path);
//     return redData.map(redDataitem => new Offer(redDataitem));
//   }

//   static async getByUrl(url) {
//     const allOffers = await Offer.readAll();
//     const foundOfferData = allOffers.find(offer => offer.url === url);
//     console.log('all offers in gBU', allOffers, foundOfferData);
//     return foundOfferData ? foundOfferData : null;
//   }

//   returnRandomUserAgent() {
//     const userAgents = [
//       'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
//       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
//       'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
//       'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92',
//       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92',
//       'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 OPR/64.0.3417.92',
//       'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/70.0',
//       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/70.0',
//       'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/70.0'
//     ];
//     return userAgents[Math.floor(Math.random() * userAgents.length)];
//   }
// };

// save() {
//         const contactToSave = this;

//         return Contact.getContacts()
//             .then(contactsList => {
//                 if (!contactToSave.id) {
//                     // not given contact id - save contact with generated new id
//                     contactToSave.id = uuidv4();
//                     Contact.saveContacts([...contactsList, contactToSave]);
//                 } else if (
//                     contactToSave.id &&
//                     contactsList.find(
//                         contact => contact.id === contactToSave.id
//                     )
//                 ) {
//                     // if exists contact with given id - replace it with contactToSave
//                     const updatedList = contactsList.map(contact =>
//                         contact.id === contactToSave.id
//                             ? contactToSave
//                             : contact
//                     );
//                     Contact.saveContacts(updatedList);
//                 } else {
//                     // there's no contact with given id - error
//                     throw new Error("Contact with given id doesn't exist");
//                 }
//             })
//             .then(() => {
//                 return contactToSave;
//             });
