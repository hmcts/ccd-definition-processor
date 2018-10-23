const parseArgs = require('minimist');

const run = require('../src/main/json2xlsx');

run(parseArgs(process.argv.slice(2), {
  string: [
    'D',
    'o'
  ],
  alias: {
    sheetsDir: 'D',
    destinationXlsx: 'o'
  }
})).catch(err => console.log(err.toString()));
