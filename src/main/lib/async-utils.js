const forEach = (list, asyncFn) => Promise.all(list.map(asyncFn));

module.exports = { forEach };
