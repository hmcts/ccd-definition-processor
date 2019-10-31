const path = require('path');
const fs = require('fs');
const matcher = require('matcher');

const listFilesInDirectory = (dir, excludes = []) => {
  return fs.readdirSync(dir, {withFileTypes: true})
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

module.exports = {listFilesInDirectory};
