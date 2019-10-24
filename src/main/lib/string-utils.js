const split = (input, delimeter = ',') => {
  return input
    .split(delimeter)
    .map(el => el.trim());
};

module.exports = {split};
