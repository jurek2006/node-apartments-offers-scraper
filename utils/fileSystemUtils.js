const path = require("path");
const fs = require("fs");

exports.readJsonFile = (filename, pathRelativeToRoot) => {
  // reads and parses JSON file
  const fileAbsolutePath = path.resolve(pathRelativeToRoot, filename);

  return new Promise((resolve, reject) => {
    fs.readFile(fileAbsolutePath, (err, data) => {
      if (err) reject(err);
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

exports.saveJsonFile = (data, filename, pathRelativeToRoot) => {
  // converts object data to JSON and saves to file
  // resolves to true if succeeded
  const fileAbsolutePath = path.resolve(pathRelativeToRoot, filename);

  return new Promise((resolve, reject) => {
    fs.writeFile(fileAbsolutePath, JSON.stringify(data), err => {
      if (err) reject(err);
      resolve(true);
    });
  });
};

// NOT NEEDED IN THIS PROJECT ?
// exports.deleteFile = (filename, pathRelativeToRoot) => {
//     // deletes file
//     const fileAbsolutePath = path.resolve(pathRelativeToRoot, filename);

//     return new Promise((resolve, reject) => {
//         fs.unlink(fileAbsolutePath, err => {
//             if (err) reject(err);
//             resolve(true);
//         });
//     });
// };
