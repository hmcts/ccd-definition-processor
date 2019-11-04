const fs = require('fs');
const path = require('path');
const glob = require('glob');
const exclusionUtils = require('./exclusion-utils');
const matcher = require('matcher');

const readJson = (filename, processFn) => {
  return new Promise((resolve) => {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
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
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};

const exists = (path) => fs.existsSync(path);

const getJsonFiles = (directory, exclusions = []) => {
  const paths = glob.sync(directory + '/**/*.json');
  const relativePaths = toRelativePaths(paths, directory);
  exclusions = exclusions.map(exclusion => exclusionUtils.prepareExclusion(exclusion));
  return exclusions.length === 0 ? relativePaths : relativePaths.filter(
    path => !exclusions.some(exclusion => matcher.isMatch(path, exclusion)));
};

function toRelativePaths (array, root) {
  return array.map(
    file => path.relative(root, file));
}

module.exports = {
  writeJson,
  readJson,
  getJsonFilePaths: getJsonFiles,
  exists
};
