const { readJsonFile, saveJsonFile } = require('../utils/fileSystemUtils');
const { OFFERS_FILE } = require('../config/config');

module.exports = class Offer {
  constructor(offerData) {
    this.offerData = offerData;
  }

  save() {
    // add saving of offer instance
    console.log('saving data instance', this);
  }

  update() {
    const offerToUpdate = this;
    console.log(`update offer with url ${offerToUpdate.url}`);
    // const allContacts = await readAll();
  }

  static saveAll(offersArray) {
    // returns promise which resolves to true if saving succeed
    return saveJsonFile(offersArray, OFFERS_FILE.filename, OFFERS_FILE.path);
  }

  static async readAll() {
    const redData = await readJsonFile(OFFERS_FILE.filename, OFFERS_FILE.path);
    return redData.map(redDataitem => new Offer(redDataitem));
  }

  static async getByUrl(url) {
    const allOffers = await Offer.readAll();
    const foundOfferData = allOffers.find(offer => offer.url === url);
    console.log('all offers in gBU', allOffers, foundOfferData);
    return foundOfferData ? foundOfferData : null;
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
};

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
