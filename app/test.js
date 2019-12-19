const utils = require('./utils');
const { readJsonFile, saveJsonFile } = require('../utils/fileSystemUtils');
const gSheets = require('./gsheets');
const Offer = require('../models/offer');
const { OFFERS_FILE } = require('../config/config');

const testingOffer = new Offer(
  'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-CID3-IDAFMGG.html#7ad347de0f',
  {
    url:
      'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-CID3-IDAFMGG.html#7ad347de0f',
    offerID: '541906702',
    price: 1400,
    priceWithRent: 1860,
    rent: 460,
    area: '50',
    rooms: '2 pokoje',
    furniture: 'Tak',
    floor: '4',
    building: 'Blok',
    offerType: 'Osoby prywatnej',
    userName: 'Agnieszka',
    userLink: 'https://www.olx.pl/oferty/uzytkownik/ljVKU/',
    addedDate: '1 grudnia 2019',
    addedTime: '16:25'
  }
);
const testingOffer2 = new Offer(
  'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-55m2-CID3-IDCIeb7.html#7ad347de0f',
  {
    url:
      'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-55m2-CID3-IDCIeb7.html#7ad347de0f',
    offerID: '572041705',
    price: 1900,
    priceWithRent: 2300,
    rent: 400,
    area: '55',
    rooms: '3 pokoje',
    furniture: 'Tak',
    floor: '5',
    building: 'Blok',
    offerType: 'Osoby prywatnej',
    userName: 'Sławomir',
    userLink: 'https://www.olx.pl/oferty/uzytkownik/1ojxF/',
    addedDate: '1 grudnia 2019',
    addedTime: '23:43'
  }
);

const wrongOffer = new Offer();

const offersArray = [testingOffer, testingOffer2];

(async () => {
  // const savingStatus = await Offer.saveAll(offersArray);
  // const savingStatus = await testingOffer.save();
  // console.log(savingStatus);
  Offer.updateStatusForAll('xYx');
})();
