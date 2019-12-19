const fs = require('fs');
const csvjson = require('csvjson');
const moment = require('moment');

const saveJsonFile = async (filePath, dataToSave) => {
  let data = JSON.stringify(dataToSave, null, 2);

  await writeFile(filePath, data);
};

// in csvjson delimiter has to be different than period to work properly with polish decimal number format
const saveCsvFile = async (filePath, dataToSave) => {
  const csvData = csvjson.toCSV(dataToSave, {
    headers: 'key',
    delimiter: '\t'
  });

  await writeFile(filePath, csvData);
};

const convertDataToCsv = dataToSave => {
  return csvjson.toCSV(dataToSave, {
    headers: 'key',
    delimiter: '\t'
  });
};

const convertCsvToArray = dataCsv => {
  return csvjson.toArray(dataCsv, {
    delimiter: '\t'
  });
};

const writeFile = async (filePath, data) => {
  fs.writeFile(filePath, data, err => {
    if (err) throw err;
    console.log(`Data written to file ${filePath}`);
  });
};

// should be named - generateTimeStamp
const getTimeStamp = () => {
  return moment().format();
};

const convertDataToNumber = priceInZl =>
  +priceInZl
    .trim()
    .replace(' zł', '')
    .replace(',', '.')
    .replace(' ', '') //space got from olx price (different than normal)
    .replace(' ', '') //normal space
    .replace('m²', '');

const convertNumberToStringWithDecimalSeparator = (number, separator = ',') =>
  separator === '.'
    ? number.toString()
    : number.toString().replace('.', separator);

const getTimeAndDate = string => {
  const [time, date] = string
    .trim()
    .split(' o ')[1]
    .split(', ');
  return {
    time,
    date
  };
};

module.exports = {
  saveJsonFile,
  saveCsvFile,
  getTimeStamp,
  convertDataToNumber,
  getTimeAndDate,
  convertDataToCsv,
  convertCsvToArray,
  convertNumberToStringWithDecimalSeparator
};
