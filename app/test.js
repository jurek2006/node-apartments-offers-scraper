const utils = require("./utils.js");

console.log(utils.convertDataToNumber("1 250,50 zł"));
console.log(utils.convertDataToNumber("52 m²"));

console.log(
  utils.getTimeAndDate(
    " Dodane z telefonu o 20:00, 17 listopada 2019, ID ogłoszenia: 569089428"
  )
);
console.log(
  utils.getTimeAndDate(
    "Dodane o 17:56, 17 listopada 2019, ID ogłoszenia: 481875641"
  )
);
