const { google } = require("googleapis");
const privateGoogleAuthKey = require("./privateConfig/privateGoogleAuthKey.json");
const config = require("../config/config");

const authorizeAndReturnClient = async () => {
  const client = await new google.auth.JWT(
    privateGoogleAuthKey.client_email,
    null,
    privateGoogleAuthKey.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
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

const saveToGoogleSheets = async dataToSave => {
  const authorizedClient = await authorizeAndReturnClient();
  const googleSheetsApi = google.sheets({
    version: "v4",
    auth: authorizedClient
  });

  const savingOptions = {
    spreadsheetId: config.GOOGLE_SPREADSHEET_ID,
    range: "Arkusz1!A1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: dataToSave
    }
  };

  return await googleSheetsApi.spreadsheets.values.update(savingOptions);
};

module.exports = { saveToGoogleSheets };
