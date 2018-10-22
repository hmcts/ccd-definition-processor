const parseArgs = require('minimist');

const run = require('../src/main/xlsx2json');

run(parseArgs(process.argv.slice(2), {
  string: [
    'i',
    'D'
  ],
  alias: {
    sourceXlsx: 'i',
    sheetsDir: 'D'
  }
})).catch((err) => console.log(err.toString()));
