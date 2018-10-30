const fs = require('fs');
const path = require('path');

const readJson = filename => {
  return new Promise((resolve) => {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) throw err;
      resolve(JSON.parse(data));
    });
  });
};

const writeJson = (filename, json) => {
  return new Promise((resolve) => {
    fs.writeFile(filename, json, (err) => {
      if (err) throw err;
      resolve();
    });
  });
};

const exists = (path) => {
  return fs.existsSync(path);
};

const listJsonFilesInFolder = (dir) => {
  const files = fs.readdirSync(dir);
  return files.filter((file) => {
    return path.extname(file) === '.json';
  });
};

module.exports = { writeJson, readJson, listJsonFilesInFolder, exists };
