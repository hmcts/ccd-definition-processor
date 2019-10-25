const split = (input, delimiter = ',') => {
  return input
    .split(delimiter)
    .map(el => el.trim());
};

module.exports = {split};
