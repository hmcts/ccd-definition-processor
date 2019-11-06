const groupToSheets = paths => {
  return paths.reduce((groupMap, filePath) => {
    // Split on the first '/'
    const splitPath = filePath.split(/\/(.+)/, 2);
    const sheetName = splitPath[0];

    if (groupMap[sheetName] === undefined) {
      groupMap[sheetName] = [];
    }

    if (splitPath.length > 1) {
      const jsonFragment = splitPath[1];
      groupMap[sheetName].push(jsonFragment);
    }

    return groupMap;
  }, {});
};

module.exports = { groupToSheets };
