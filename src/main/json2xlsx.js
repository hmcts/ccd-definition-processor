const path = require('path');
const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const asyncUtils = require('./lib/async-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');

const validateArgs = (args) => {
  if (args.clear) {
    assert(!!args.sourceXlsx, 'source spreadsheet file argument (-i) is required');
    assert(fileUtils.exists(args.sourceXlsx), `spreadsheet file ${args.sourceXlsx} not found`);
  } else {
    assert(!!args.sourceXlsx, 'source spreadsheet file argument (-i) is required');
    assert(!!args.destinationXlsx, 'destination spreadsheet file argument (-o) is required');
    assert(!!args.sheetsDir, 'sheets directory argument (-D) is required');

    assert(fileUtils.exists(args.sourceXlsx), `source spreadsheet file ${args.sourceXlsx} not found`);
    assert(fileUtils.exists(args.sheetsDir), `sheets directory ${args.sheetsDir} not found`);
  }
};

const run = async (args) => {
  validateArgs(args);

  console.log(`Import...\n loading workbook: ${args.sourceXlsx}`);
  const builder = new ccdUtils.SpreadsheetBuilder(args.sourceXlsx);
  await builder.loadAsync();

  let sheets;
  if (args.clear) {
    sheets = args._.length > 0 ? args._ : builder.allSheets().map(sheet => sheet.name());

    await asyncUtils.forEach(sheets, async (sheet) => {
      console.log(`  clearing sheet: ${sheet}`);
      builder.clearSheetData(sheet);
    });

    args.destinationXlsx = args.sourceXlsx;
  } else {
    sheets = args._.length > 0 ? args._ : fileUtils
      .listJsonFilesInFolder(args.sheetsDir)
      .map((filename) => filename.slice(0, -5));

    await asyncUtils.forEach(sheets, async (sheet) => {
      const jsonPath = path.join(args.sheetsDir, `${sheet}.json`);
      console.log(`  importing sheet data: ${jsonPath}`);
      builder.updateSheetDataJson(sheet, await fileUtils.readJson(jsonPath));
    });
  }

  console.log(` saving workbook: ${args.destinationXlsx}`);
  await builder.saveAsAsync(args.destinationXlsx);

  console.log('done.');
};

module.exports = run;
