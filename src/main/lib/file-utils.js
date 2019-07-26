const fs = require('fs');
const path = require('path');

const readJson = (filename, processFn) => {
  return new Promise((resolve) => {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) throw err;
      if (processFn) {
        data = processFn(data);
      }
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

const listFilesInDirectory = (dir, includeOnly) => {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((file) => {
      if (file.isDirectory()) {
        return true;
      } else {
        return path.extname(file.name) === '.json';
      }
    })
    .filter((file) => {
      if (includeOnly != null && includeOnly.length > 0) {
        return includeOnly.includes(path.basename(file.name, '.json'));
      }
      return true;
    });
};

module.exports = { writeJson, readJson, listFilesInDirectory, exists };
