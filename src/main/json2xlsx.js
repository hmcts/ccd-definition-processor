const path = require('path');
const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const asyncUtils = require('./lib/async-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');

const sourceXlsx = './data/ccd-template.xlsx';

const validateArgs = (args) => {
  assert(!!args.sheetsDir, 'sheets directory argument (-D) is required');
  assert(!!args.destinationXlsx, 'spreadsheet file argument (-o) is required');

  assert(fileUtils.exists(args.sheetsDir), `sheets directory ${args.sheetsDir} not found`);
};

const run = async (args) => {
  validateArgs(args);

  console.log(`Import...\n loading workbook: ${sourceXlsx}`);
  const builder = new ccdUtils.SpreadsheetBuilder(sourceXlsx);
  await builder.loadAsync();

  const sheets = args._.length > 0 ? args._ : fileUtils
    .listJsonFilesInFolder(args.sheetsDir)
    .map((filename) => filename.slice(0, -5));

  await asyncUtils.forEach(sheets, async (sheet) => {
    const jsonPath = path.join(args.sheetsDir, `${sheet}.json`);
    console.log(`  importing sheet data: ${jsonPath}`);
    builder.updateSheetDataJson(sheet, await fileUtils.readJson(jsonPath));
  });

  console.log(` saving workbook: ${args.destinationXlsx}`);
  await builder.saveAsAsync(args.destinationXlsx);

  console.log('done.');
};

module.exports = run;
