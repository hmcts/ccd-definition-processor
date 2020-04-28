const fs = require('fs');
const path = require('path');
const glob = require('glob');
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

const getJsonFilePaths = (directory, exclusions = []) => {
  const paths = glob.sync(directory + '/**/*.json');
  const relativePaths = toRelativePaths(paths, directory);
  return exclusions.length === 0 ? relativePaths : relativePaths.filter(
    path => !exclusions.some(exclusion => path.split('/').some(chunk => matcher.isMatch(chunk, exclusion))));
};

function toRelativePaths (array, root) {
  return array.map(file => path.relative(root, file))
    .sort((a, b) => {
      const firstFilename = a.replace('.json', '');
      const secondFilename = b.replace('.json', '');

      //Looking for files with similar names
      if (secondFilename.startsWith(firstFilename)) {
        //Found files that have nearly identical names. Put longer name later.
        return -1;
      } else {
        //Otherwise, just return in their original order
        return 0;
      }
    });
}

module.exports = {
  writeJson,
  readJson,
  getJsonFilePaths,
  exists
};
