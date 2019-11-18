const fs = require("fs");

const saveJsonFile = async (filePath, dataToSave) => {
  let data = JSON.stringify(dataToSave, null, 2);

  fs.writeFile(filePath, data, err => {
    if (err) throw err;
    console.log(`Data written to file ${filePath}`);
  });
};

module.exports = { saveJsonFile };
