const fs = require('fs');
const path = require('path');
const glob = require('glob');
const exclusionUtils = require('./exclusion-utils');

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
  let paths = glob.sync(directory + '/**/*.json');
  let relativePaths = toRelativePaths(paths, directory);
  exclusions = exclusions.map(exclusion => exclusionUtils.prepareExclusion(exclusion));
  let filteredPaths = exclusionUtils.filterPaths(relativePaths, exclusions);
  return groupToSheets(filteredPaths);
};

function toRelativePaths (array, root) {
  return array.map(
    file => path.relative(root, file));
}

function groupToSheets (paths) {
  return paths.reduce((groupMap, filePath) => {
    // Split on the first '/'
    let splitPath = filePath.split(/\/(.+)/, 2);

    if (splitPath.length > 1) {
      prepareMap(groupMap, splitPath[0]);
      groupMap[splitPath[0]].push(splitPath[1]);
    } else {
      prepareMap(groupMap, splitPath[0]);
    }

    return groupMap;
  }, {});
}

function prepareMap (map, key) {
  if (!Object.prototype.hasOwnProperty.call(map, key)) {
    map[key] = [];
  }
}

module.exports = {
  writeJson,
  readJson,
  getJsonFiles,
  exists
};
