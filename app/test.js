const utils = require("./utils");
const gSheets = require("./gsheets");

// console.log(utils.convertDataToNumber("1 250,50 zł"));
// console.log(utils.convertDataToNumber("52 m²"));

// console.log(
//   utils.getTimeAndDate(
//     " Dodane z telefonu o 20:00, 17 listopada 2019, ID ogłoszenia: 569089428"
//   )
// );
// console.log(
//   utils.getTimeAndDate(
//     "Dodane o 17:56, 17 listopada 2019, ID ogłoszenia: 481875641"
//   )
// );

// googleSheets
// gSheets.readFromGoogleSheets().then(res => {
//   console.log("res", res);
// });

// gSheets
//   .saveToGoogleSheets([
//     ["Jurek", "Skowron"],
//     ["Antek", "Bez"]
//   ])
//   .catch(err => console.log(err.message, err));

// converting data to array ready to be saved in google sheets
const data = [
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "Suterena",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Szeregowiec",
    Powierzchnia: 55,
    "Liczba pokoi": "Kawalerka",
    "Czynsz (dodatkowo)": 1,
    offerID: "569244641",
    price: 1300,
    userName: "Jacek",
    added:
      " Dodane z telefonu o 15:34, 18 listopada 2019, ID ogłoszenia: 569244641",
    url:
      "https://www.olx.pl/oferta/mieszkanie-olawa-CID3-IDCvuxb.html#7ad347de0f",
    title: "Mieszkanie Olawa"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "5",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 32,
    "Liczba pokoi": "Kawalerka",
    "Czynsz (dodatkowo)": 325,
    offerID: "569089428",
    price: 1200,
    userName: "Tomasz",
    added:
      " Dodane z telefonu o 20:00, 17 listopada 2019, ID ogłoszenia: 569089428",
    url:
      "https://www.olx.pl/oferta/kawalerka-do-wynajecia-CID3-IDCwQ9K.html#7ad347de0f",
    title: "Kawalerka do wynajęcia"
  },
  {
    "Oferta od": "Biuro / Deweloper",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Apartamentowiec",
    Powierzchnia: 52,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 390,
    offerID: "496346305",
    price: 1890,
    userName: "Jarek",
    added: "Dodane o 17:59, 17 listopada 2019, ID ogłoszenia: 496346305",
    url:
      "https://www.olx.pl/oferta/olawa-apartament-do-wynajecia-CID3-IDxAClz.html#7ad347de0f",
    title: "Oława apartament do wynajęcia"
  },
  {
    "Oferta od": "Biuro / Deweloper",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Apartamentowiec",
    Powierzchnia: 32,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 280,
    offerID: "481875641",
    price: 1750,
    userName: "Jarek",
    added: "Dodane o 17:56, 17 listopada 2019, ID ogłoszenia: 481875641",
    url:
      "https://www.olx.pl/oferta/mieszkanie-z-tarasem-olawa-CID3-IDvBTRL.html#7ad347de0f",
    title: "Mieszkanie z tarasem Oława"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 72,
    "Liczba pokoi": "4 i więcej",
    "Czynsz (dodatkowo)": 240,
    offerID: "565651657",
    price: 1850,
    userName: "Bartek",
    added:
      " Dodane z telefonu o 10:49, 17 listopada 2019, ID ogłoszenia: 565651657",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-CID3-IDChpPP.html#7ad347de0f",
    title: "Wynajmę mieszkanie"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Kamienica",
    Powierzchnia: 72,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 200,
    offerID: "555982921",
    price: 1700,
    userName: "Beata",
    added:
      "Dodane z telefonu o 11:04, 16 listopada 2019, ID ogłoszenia: 555982921",
    url:
      "https://www.olx.pl/oferta/mieszkanie-w-centrum-olawy-CID3-IDBCQyt.html#7ad347de0f",
    title: "Mieszkanie w centrum Oławy"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 67,
    "Liczba pokoi": "4 i więcej",
    "Czynsz (dodatkowo)": 680,
    offerID: "561889189",
    price: 1600,
    userName: "Artur",
    added:
      " Dodane z telefonu o 22:04, 14 listopada 2019, ID ogłoszenia: 561889189",
    url:
      "https://www.olx.pl/oferta/4-pokoje-olawa-chopina-CID3-IDC1D2R.html#7ad347de0f",
    title: "4 pokoje Oława Chopina"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "4",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 56,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 600,
    offerID: "550388707",
    price: 1400,
    userName: "Estera",
    added: "Dodane o 13:09, 14 listopada 2019, ID ogłoszenia: 550388707",
    url:
      "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-od-zaraz-CID3-IDBfnfd.html#7ad347de0f",
    title: "Mieszkanie do wynajęcia od zaraz. квартира негайно"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "2",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 40.35,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 300,
    offerID: "568293766",
    price: 1400,
    userName: "Aneta",
    added: "Dodane o 08:38, 14 listopada 2019, ID ogłoszenia: 568293766",
    url:
      "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-CID3-IDCswau.html#7ad347de0f",
    title: "Mieszkanie do wynajęcia"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "2",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 53,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 500,
    offerID: "565077160",
    price: 1100,
    userName: "Joanna",
    added:
      " Dodane z telefonu o 06:15, 14 listopada 2019, ID ogłoszenia: 565077160",
    url:
      "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-CID3-IDCf0nK.html#7ad347de0f",
    title: "Mieszkanie do wynajęcia"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "Parter",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 54,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 550,
    offerID: "561839710",
    price: 1500,
    userName: "Ewa",
    added: "Dodane o 16:54, 13 listopada 2019, ID ogłoszenia: 561839710",
    url:
      "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-CID3-IDC1qaO.html#7ad347de0f",
    title: "Mieszkanie do wynajęcia"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "Parter",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 27,
    "Liczba pokoi": "Kawalerka",
    "Czynsz (dodatkowo)": 400,
    offerID: "561703173",
    price: 1100,
    userName: "Ihor",
    added:
      " Dodane z telefonu o 16:09, 12 listopada 2019, ID ogłoszenia: 561703173",
    url: "https://www.olx.pl/oferta/-CID3-IDC0QEB.html#7ad347de0f",
    title: "Сдам кавалерку семейной паре од ноября"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "4",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 48,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 1,
    offerID: "567735431",
    price: 2200,
    userName: "Andżelika",
    added:
      " Dodane z telefonu o 15:28, 11 listopada 2019, ID ogłoszenia: 567735431",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-2-pokojowe-od-1-12-2019-CID3-IDCq9W5.html#7ad347de0f",
    title: "Wynajmę mieszkanie 2 pokojowe od 1.12.2019"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "2",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 51,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 500,
    offerID: "561264554",
    price: 1500,
    userName: "A G",
    added:
      " Dodane z telefonu o 13:25, 11 listopada 2019, ID ogłoszenia: 561264554",
    url:
      "https://www.olx.pl/oferta/mieszkanie-2-pokojowe-CID3-IDBZ0y6.html#7ad347de0f",
    title: "Mieszkanie 2-pokojowe"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 49,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 540,
    offerID: "567578058",
    price: 1600,
    userName: "Kamila",
    added:
      " Dodane z telefonu o 20:43, 10 listopada 2019, ID ogłoszenia: 567578058",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-2-pokojowe-os-sobieskiego-CID3-IDCpuYO.html#7ad347de0f",
    title: "Wynajmę mieszkanie 2-pokojowe Os. Sobieskiego"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Apartamentowiec",
    Powierzchnia: 40,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 300,
    offerID: "497044595",
    price: 1600,
    userName: "Iwona",
    added:
      " Dodane z telefonu o 19:48, 10 listopada 2019, ID ogłoszenia: 497044595",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-olawa-CID3-IDxDy0j.html#7ad347de0f",
    title: "Wynajme mieszkanie Oława"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "4",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 42,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 400,
    offerID: "567488598",
    price: 1500,
    userName: "Wojciech",
    added:
      " Dodane z telefonu o 14:58, 10 listopada 2019, ID ogłoszenia: 567488598",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-zaciszna-CID3-IDCp7HU.html#7ad347de0f",
    title: "Wynajmę mieszkanie Zaciszna"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Kamienica",
    Powierzchnia: 57,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 1,
    offerID: "567465853",
    price: 1300,
    userName: "Jarosław",
    added:
      " Dodane z telefonu o 13:36, 10 listopada 2019, ID ogłoszenia: 567465853",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-57m2-CID3-IDCp1N3.html#7ad347de0f",
    title: "Wynajmę mieszkanie 57m2"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Dom wolnostojący",
    Powierzchnia: 35,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 1,
    offerID: "520573872",
    price: 1800,
    userName: "Tomasz",
    added: "Dodane o 17:21, 9 listopada 2019, ID ogłoszenia: 520573872",
    url:
      "https://www.olx.pl/oferta/wynajme-2-pokoje-w-olawie-CID3-IDzeh2M.html#7ad347de0f",
    title: "Wynajmę 2 pokoje w Oławie"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 51.5,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 488,
    offerID: "567333550",
    price: 1500,
    userName: "Elżbieta",
    added: "Dodane o 17:11, 9 listopada 2019, ID ogłoszenia: 567333550",
    url:
      "https://www.olx.pl/oferta/mieszkanie-zaciszna-CID3-IDCotn8.html#7ad347de0f",
    title: "Mieszkanie Zaciszna"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Kamienica",
    Powierzchnia: 64,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 300,
    offerID: "553252662",
    price: 1200,
    userName: "Janina",
    added: "Dodane o 15:50, 9 listopada 2019, ID ogłoszenia: 553252662",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-w-olawie-CID3-IDBroi2.html#7ad347de0f",
    title: "wynajmę mieszkanie w Oławie"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 47.5,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 240,
    offerID: "540852288",
    price: 700,
    userName: "Piotr",
    added: "Dodane o 13:15, 9 listopada 2019, ID ogłoszenia: 540852288",
    url:
      "https://www.olx.pl/oferta/mieszkanie-47m-2-pokoje-olawa-CID3-IDABmo0.html#7ad347de0f",
    title: "Mieszkanie 47m, 2 pokoje, Oława"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 59,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 440,
    offerID: "531888984",
    price: 1400,
    userName: "Rafał",
    added:
      " Dodane z telefonu o 12:27, 7 listopada 2019, ID ogłoszenia: 531888984",
    url:
      "https://www.olx.pl/oferta/mieszkanie-w-olawie-zaciszna-CID3-IDzZKCA.html#7ad347de0f",
    title: "Mieszkanie w Oławie, Zaciszna"
  },
  {
    "Oferta od": "Biuro / Deweloper",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Szeregowiec",
    Powierzchnia: 70,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 200,
    offerID: "551790649",
    price: 10,
    userName: "jarek",
    added: "Dodane o 19:25, 5 listopada 2019, ID ogłoszenia: 551790649",
    url:
      "https://www.olx.pl/oferta/mieszkanie-dla-par-w-olawie-70-mkw-CID3-IDBlfXb.html#7ad347de0f",
    title: "mieszkańie dla par w oławie 70 mkw"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "4",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Pozostałe",
    Powierzchnia: 50,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 450,
    offerID: "538795563",
    price: 1400,
    userName: "Dawid",
    added: "Dodane o 21:43, 4 listopada 2019, ID ogłoszenia: 538795563",
    url:
      "https://www.olx.pl/oferta/wynajme-2-pok-mieszkanie-olawa-rynek-blisko-pks-50-m2-CID3-IDAsJl1.html#7ad347de0f",
    title: "Wynajmę 2 pok. mieszkanie Oława Rynek blisko PKS 50 m2"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "4",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 25.5,
    "Liczba pokoi": "Kawalerka",
    "Czynsz (dodatkowo)": 1,
    offerID: "566092248",
    price: 1500,
    userName: "Krysia",
    added: "Dodane o 21:10, 3 listopada 2019, ID ogłoszenia: 566092248",
    url:
      "https://www.olx.pl/oferta/kawalerka-rezerwacja-do-25-11-2019-CID3-IDCjgs8.html#7ad347de0f",
    title: "Kawalerka rezerwacja do 25.11.2019"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Kamienica",
    Powierzchnia: 80,
    "Liczba pokoi": "4 i więcej",
    "Czynsz (dodatkowo)": 50,
    offerID: "566048886",
    price: 2500,
    userName: "Marcin",
    added: "Dodane o 18:31, 3 listopada 2019, ID ogłoszenia: 566048886",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-pokoj-dla-pracownikow-z-ukrainy-CID3-IDCj5aK.html#7ad347de0f",
    title: "Wynajmę mieszkanie/pokój dla pracowników z Ukrainy"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "2",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 70,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 1,
    offerID: "555775805",
    price: 20,
    userName: "Klaudia",
    added: "Dodane o 18:44, 2 listopada 2019, ID ogłoszenia: 555775805",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszaknie-od-20-zl-CID3-IDBBYFT.html#7ad347de0f",
    title: "wynajmę mieszaknie od 20 zł"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "2",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 85,
    "Liczba pokoi": "4 i więcej",
    "Czynsz (dodatkowo)": 1,
    offerID: "525936875",
    price: 20,
    userName: "Klaudia",
    added: "Dodane o 18:40, 2 listopada 2019, ID ogłoszenia: 525936875",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-dla-pracownikow-20-zl-osoba-doba-CID3-IDzAMcP.html#7ad347de0f",
    title: "wynajmę mieszkanie dla pracowników 20 zł osoba /doba"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "6",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 60,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 50,
    offerID: "536497871",
    price: 500,
    userName: "Vasyl",
    added: "Dodane o 10:06, 2 listopada 2019, ID ogłoszenia: 536497871",
    url:
      "https://www.olx.pl/oferta/wynajem-mieszkania-CID3-IDAj5Bt.html#7ad347de0f",
    title: "Wynajem mieszkania"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "2",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 69,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 530,
    offerID: "565503327",
    price: 1600,
    userName: "Halina",
    added:
      " Dodane z telefonu o 20:12, 31 października 2019, ID ogłoszenia: 565503327",
    url:
      "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-olawa-okazja-CID3-IDCgNfp.html#7ad347de0f",
    title: "Mieszkanie do wynajęcia olawa okazja !!"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Dom wolnostojący",
    Powierzchnia: 270,
    "Liczba pokoi": "4 i więcej",
    "Czynsz (dodatkowo)": 650,
    offerID: "565453485",
    price: 650,
    userName: "Ewelina",
    added:
      " Dodane z telefonu o 15:53, 31 października 2019, ID ogłoszenia: 565453485",
    url:
      "https://www.olx.pl/oferta/wynajme-pokoje-CID3-IDCgAhw.html#7ad347de0f",
    title: "Wynajmę pokoje"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 52,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 500,
    offerID: "545650208",
    price: 1600,
    userName: "Anna",
    added: "Dodane o 10:08, 31 października 2019, ID ogłoszenia: 545650208",
    url:
      "https://www.olx.pl/oferta/mieszkanie-do-wynajecia-CID3-IDAWuxO.html#0c1750f118",
    title: "mieszkanie do wynajęcia"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "Parter",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 46,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 300,
    offerID: "565099040",
    price: 1500,
    userName: "Ala",
    added:
      " Dodane z telefonu o 21:10, 29 października 2019, ID ogłoszenia: 565099040",
    url:
      "https://www.olx.pl/oferta/mieszkanie-na-wynajem-CID3-IDCf64E.html#0c1750f118",
    title: "Mieszkanie na wynajem"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Kamienica",
    Powierzchnia: 75,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 100,
    offerID: "564736228",
    price: 400,
    userName: "Barbara",
    added: "Dodane o 14:47, 28 października 2019, ID ogłoszenia: 564736228",
    url:
      "https://www.olx.pl/oferta/do-wynajecia-mieszkanie-3-pokojowe-CID3-IDCdzGQ.html#0c1750f118",
    title: "Do wynajęcia mieszkanie 3 pokojowe"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Szeregowiec",
    Powierzchnia: 83,
    "Liczba pokoi": "4 i więcej",
    "Czynsz (dodatkowo)": 1,
    offerID: "564449832",
    price: 20,
    userName: "john",
    added: "Dodane o 10:15, 27 października 2019, ID ogłoszenia: 564449832",
    url:
      "https://www.olx.pl/oferta/mieszkanie-olawa-CID3-IDCcnby.html#0c1750f118",
    title: "mieszkanie Olawa"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "2",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Kamienica",
    Powierzchnia: 85,
    "Liczba pokoi": "4 i więcej",
    "Czynsz (dodatkowo)": 2,
    offerID: "564447433",
    price: 20,
    userName: "Teodor",
    added: "Dodane o 10:03, 27 października 2019, ID ogłoszenia: 564447433",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-CID3-IDCcmyR.html#0c1750f118",
    title: "wynajmę mieszkanie"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 58,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 600,
    offerID: "563898501",
    price: 1600,
    userName: "Łukasz",
    added: "Dodane o 09:28, 24 października 2019, ID ogłoszenia: 563898501",
    url: "https://www.olx.pl/oferta/mieszkanie-CID3-IDCa3L7.html#0c1750f118",
    title: "Mieszkanie"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "1",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 57,
    "Liczba pokoi": "3 pokoje",
    "Czynsz (dodatkowo)": 210,
    offerID: "502082386",
    price: 700,
    userName: "Magdalena",
    added: "Dodane o 22:01, 23 października 2019, ID ogłoszenia: 502082386",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-pokoj-CID3-IDxYGz0.html#0c1750f118",
    title: "Wynajmę mieszkanie/ pokój"
  },
  {
    "Oferta od": "Osoby prywatnej",
    Poziom: "3",
    Umeblowane: "Tak",
    "Rodzaj zabudowy": "Blok",
    Powierzchnia: 50,
    "Liczba pokoi": "2 pokoje",
    "Czynsz (dodatkowo)": 1,
    offerID: "553836067",
    price: 1500,
    userName: "Mariusz",
    added: "Dodane o 10:12, 20 października 2019, ID ogłoszenia: 553836067",
    url:
      "https://www.olx.pl/oferta/wynajme-mieszkanie-dla-firmy-lub-osob-prywatnych-CID3-IDBtQ3N.html#0c1750f118",
    title: "Wynajmę mieszkanie dla firmy lub osób prywatnych"
  }
];

const dataCsv = utils.convertDataToCsv(data);
const dataArray = utils.convertCsvToArray(dataCsv);
console.log(dataArray);

gSheets
  .saveToGoogleSheets(dataArray)
  .catch(err => console.log(err.message, err));
