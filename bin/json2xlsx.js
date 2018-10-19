const parseArgs = require('minimist');

const run = require('../src/main/json2xlsx');

run(parseArgs(process.argv.slice(2), {
  string: [
    'i',
    'o',
    'D'
  ],
  boolean: [
    'clear'
  ],
  alias: {
    sourceXlsx: 'i',
    destinationXlsx: 'o',
    sheetsDir: 'D'
  },
  default: {
    sourceXlsx: './data/ccd-template.xlsx'
  }
})).catch(err => console.log(err.toString()));
