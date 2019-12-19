const { google } = require('googleapis');
const privateGoogleAuthKey = require('./privateConfig/privateGoogleAuthKey.json');
const config = require('../config/config');

const authorizeAndReturnClient = async () => {
  const client = await new google.auth.JWT(
    privateGoogleAuthKey.client_email,
    null,
    privateGoogleAuthKey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  await client.authorize(function(err, tokens) {
    if (err) {
      console.log(err);
      return;
    }
  });
  return client;
};

// NOT NEEDED NOW

// const readFromGoogleSheets = async () => {
//   const authorizedClient = await authorizeAndReturnClient();
//   const googleSheetsApi = google.sheets({
//     version: "v4",
//     auth: authorizedClient
//   });

//   const opt = {
//     spreadsheetId: "1NabcyX9jnAGQCZjnylhKSc8T30SeoeDS5CUudQoqZvI",
//     range: "Arkusz1!A2:B5"
//   };

//   const data = await googleSheetsApi.spreadsheets.values.get(opt);
//   return data.data.values;
// };

exports.clearGoogleSheets = async () => {
  const authorizedClient = await authorizeAndReturnClient();
  const googleSheetsApi = google.sheets({
    version: 'v4',
    auth: authorizedClient
  });

  const clearingOptions = {
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    range: 'Test'
  };
  return await googleSheetsApi.spreadsheets.values.clear(clearingOptions);
};

exports.saveToGoogleSheets = async dataToSave => {
  const authorizedClient = await authorizeAndReturnClient();
  const googleSheetsApi = google.sheets({
    version: 'v4',
    auth: authorizedClient
  });

  const savingOptions = {
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    range: 'Test!A1',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: dataToSave
    }
  };

  return await googleSheetsApi.spreadsheets.values.update(savingOptions);
};

exports.sortInGoogleSheets = async () => {
  const authorizedClient = await authorizeAndReturnClient();
  const googleSheetsApi = google.sheets({
    version: 'v4',
    auth: authorizedClient
  });

  let requests = [];
  requests.push({
    sortRange: {
      range: {
        sheetId: 1549031368,
        startRowIndex: 1, // omit first row (columns' names)
        // endRowIndex: 10, // to the end
        startColumnIndex: 0,
        endColumnIndex: 15
      },
      sortSpecs: [
        {
          dimensionIndex: 1,
          sortOrder: 'ASCENDING'
        }
        // {
        //   dimensionIndex: 3,
        //   sortOrder: 'DESCENDING'
        // },
        // {
        //   dimensionIndex: 4,
        //   sortOrder: 'DESCENDING'
        // }
      ]
    }
  });

  const batchUpdateRequest = {
    requests
  };
  const sortingOptions = {
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    resource: batchUpdateRequest
  };

  return await googleSheetsApi.spreadsheets.batchUpdate(
    sortingOptions,
    (err, response) => {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
};
exports.formatInGoogleSheets = async () => {
  const authorizedClient = await authorizeAndReturnClient();
  const googleSheetsApi = google.sheets({
    version: 'v4',
    auth: authorizedClient
  });

  let requests = [];

  requests.push({
    repeatCell: {
      range: {
        sheetId: 1549031368,
        startRowIndex: 1,
        startColumnIndex: 0,
        endColumnIndex: 1
      },
      cell: {
        userEnteredFormat: {
          numberFormat: {
            type: 'DATE',
            pattern: 'dd mmm yyyy'
          }
        }
      },
      fields: 'userEnteredFormat.numberFormat'
    }
  });

  requests.push({
    sortRange: {
      range: {
        sheetId: 1549031368,
        startRowIndex: 1, // omit first row (columns' names)
        // endRowIndex: 10, // to the end
        startColumnIndex: 0,
        endColumnIndex: 15
      },
      sortSpecs: [
        {
          dimensionIndex: 0,
          sortOrder: 'DESCENDING'
        }
        // {
        //   dimensionIndex: 3,
        //   sortOrder: 'DESCENDING'
        // },
        // {
        //   dimensionIndex: 4,
        //   sortOrder: 'DESCENDING'
        // }
      ]
    }
  });

  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId: 1549031368,
        gridProperties: {
          frozenRowCount: 1
        }
      },
      fields: 'gridProperties.frozenRowCount'
    }
  });

  const batchUpdateRequest = {
    requests
  };
  const sortingOptions = {
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    resource: batchUpdateRequest
  };

  return await googleSheetsApi.spreadsheets.batchUpdate(
    sortingOptions,
    (err, response) => {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        console.log(response);
      }
    }
  );
};
