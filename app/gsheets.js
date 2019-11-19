const { google } = require("googleapis");
const privateGoogleAuthKey = require("./privateConfig/privateGoogleAuthKey.json");

const getFromGoogle = async client => {
  const googleSheetsApi = google.sheets({ version: "v4", auth: client });

  const opt = {
    spreadsheetId: "1NabcyX9jnAGQCZjnylhKSc8T30SeoeDS5CUudQoqZvI",
    range: "Arkusz1!A2:B5"
  };

  const data = await googleSheetsApi.spreadsheets.values.get(opt);
  return data.data.values;
};

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

const readFromGoogleSheets = async () => {
  const authorizedClient = await authorizeAndReturnClient();
  return await getFromGoogle(authorizedClient);
};

module.exports = { readFromGoogleSheets };
