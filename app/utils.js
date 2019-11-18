const fs = require("fs");
const csvjson = require("csvjson");
const moment = require("moment");

const saveJsonFile = async (filePath, dataToSave) => {
  let data = JSON.stringify(dataToSave, null, 2);

  await writeFile(filePath, data);
};

const saveCsvFile = async (filePath, dataToSave) => {
  const csvData = csvjson.toCSV(dataToSave, {
    headers: "key"
  });

  await writeFile(filePath, csvData);
};

const writeFile = async (filePath, data) => {
  fs.writeFile(filePath, data, err => {
    if (err) throw err;
    console.log(`Data written to file ${filePath}`);
  });
};

const getTimeStamp = () => {
  return moment().format();
};
module.exports = { saveJsonFile, saveCsvFile, getTimeStamp };
