const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const asyncUtils = require('./lib/async-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');

const validateArgs = (args) => {
  assert(!!args.sourceXlsx, 'spreadsheet file argument (-i) is required');
  assert(!!args.sheetsDir, 'sheets directory argument (-D) is required');

  assert(fileUtils.exists(args.sourceXlsx), `spreadsheet file ${args.sourceXlsx} not found`);
  assert(fileUtils.exists(args.sheetsDir), `sheets directory ${args.sheetsDir} not found`);
};

const run = async (args) => {
  validateArgs(args);

  console.log('Export...\n loading workbook: ' + args.sourceXlsx);
  const converter = new ccdUtils.SpreadsheetConvert(args.sourceXlsx);
  const sheets = args._ ? args._ : converter.allSheets();

  await asyncUtils.forEach(sheets, async sheet => {
    const jsonFilePath = args.sheetsDir + sheet + '.json';
    console.log(' converting sheet to JSON: ' + sheet + ' => ' + jsonFilePath);
    await converter.sheet2Json(sheet, jsonFilePath);
  });

  console.log('done.');
};

module.exports = run;
