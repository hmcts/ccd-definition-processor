const fs = require('fs');
const path = require('path');
const matcher = require('matcher');

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

const listFilesInDirectory = (dir, excludes = []) => {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((file) => {
      if (file.isDirectory()) {
        return true;
      } else {
        return path.extname(file.name) === '.json';
      }
    })
    .filter((file) =>
      !excludes.some(el => matcher.isMatch(file.name, el))
    );
};

function listFilesInDirectoryRec (root, dir, excludes = []) {
  let files = [];

  fs.readdirSync(dir, { withFileTypes: true })
    .filter(file =>
      file.isDirectory() ? true : path.extname(file.name) === '.json')
    .filter(file =>
      !excludes.some(el => matcher.isMatch(file.name, el))
    ).forEach(file => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        files.push(listFilesInDirectoryRec(root, fullPath, excludes));
      } else {
        files.push(path.relative(root, fullPath));
      }
    });

  return files;
}
module.exports = { writeJson, readJson, listFilesInDirectory, exists, listFilesInDirectoryRec };
