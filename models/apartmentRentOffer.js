const Offer = require('./offer');
const puppeteer = require('puppeteer');
const utils = require('../app/utils');
const { OFFERS_FILE } = require('../config/config');

module.exports = class ApartmentRentOffer extends Offer {
  constructor(offerData) {
    super(offerData);
    this.offerData = offerData;
  }

  async goToOfferPageAndScrap() {
    console.log('scrap method', this);

    const { url, title } = this.offerData;

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
  }
};
