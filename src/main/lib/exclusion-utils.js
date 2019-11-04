function isDirExclusion (exclusion) {
  return exclusion.indexOf('.') === -1;
}

const prepareExclusion = (exclusion) => {
  let prepared = exclusion;
  if (isDirExclusion(exclusion)) {
    if (prepared.charAt(prepared.length - 1) !== '/') {
      prepared = prepared + '/';
    }
    if (exclusion.indexOf('*') !== 0) {
      prepared = '*' + prepared;
    }
    if (exclusion.lastIndexOf('*') !== exclusion.length - 1) {
      prepared = prepared + '*';
    }
  } else {
    if (exclusion.indexOf('*') !== 0) {
      prepared = '*' + prepared;
    }
  }

  return prepared;
};

module.exports = { prepareExclusion };
