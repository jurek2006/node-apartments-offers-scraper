const Offer = require('../models/offer');

const urlsArray = [
  //   'https://kultura.olawa.pl',
  //   'https://www.olx.pl/oferta/wynajme-mieszkanie-zaciszna-CID3-IDCp7HU.html#7ad347de0f'
  'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-55m2-CID3-IDCIeb7.html#7ad347de0f',
  'https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-CID3-IDAFMGG.html#7ad347de0f'
];

(async () => {
  Offer.scrapAll(urlsArray);
})();
