const path = require('path');
const fs = require('fs');

const readFile = (filename, pathRelativeToRoot) => {
  const fileAbsolutePath = path.resolve(pathRelativeToRoot, filename);

  return new Promise(resolve =>
    fs.readFile(fileAbsolutePath, (error, data) =>
      error ? resolve({ ok: false, error }) : resolve({ ok: true, data })
    )
  );
};

const parseJson = objectToParse => {
  try {
    const data = JSON.parse(objectToParse);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error };
  }
};

// reads data from Json file (with parsing) - returns promise
exports.readJsonFile = async (filename, pathRelativeToRoot) => {
  const redFromFile = await readFile(filename, pathRelativeToRoot);
  if (!redFromFile.ok) return redFromFile; //returns {ok: false, error}

  const parsedFromJson = parseJson(redFromFile.data);
  if (!parsedFromJson.ok) return parsedFromJson; //returns {ok: false, error}

  return {
    ok: true,
    data: parsedFromJson.data
  }; // when reading and parsing succeed
};

// converts object data to JSON and saves to file - returns promise
exports.saveJsonFile = (data, filename, pathRelativeToRoot) => {
  const fileAbsolutePath = path.resolve(pathRelativeToRoot, filename);

  return new Promise(resolve => {
    fs.writeFile(fileAbsolutePath, JSON.stringify(data), error => {
      if (error) resolve({ ok: false, error }); //when saving failed
      resolve({ ok: true }); // when saving succeed
    });
  });
};
