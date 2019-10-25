const split = (input, delimeter = ',') => {
  return input == null ? [] : input
    .split(delimeter)
    .map(el => el.trim());
};

module.exports = {split};
