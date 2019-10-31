function isDirExclusion (exclusion) {
  return exclusion.indexOf('.') === -1;
}

function isExcluded (filePath, exclusion) {
  let toMatch;
  if (isDirExclusion(exclusion)) {

    let index = filePath.lastIndexOf('/');
    // Return if it is a top level file
    if (index === -1) {
      return false;

    }
    toMatch = filePath.substring(0, index);
  } else {
    toMatch = filePath;
  }

  const regex = new RegExp(exclusion, 'g');
  return toMatch.match(regex) != null;
}

const prepareExclusion = (exclusion) => exclusion.replace('*', '\\w*');

const filterPaths = (paths, exclusions = []) => {
  if (exclusions.length === 0) {
    return paths;
  }

  return paths.filter(file => {
    return !exclusions.some(exclusion => isExcluded(file, exclusion));
  });
};

module.exports = { filterPaths, prepareExclusion };
