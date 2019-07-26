const path = require('path');
const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');
const jsonUtil = ccdUtils.JsonHelper;

const validateArgs = (args) => {
  assert(!!args.sourceXlsx, 'spreadsheet file argument (-i) is required');
  assert(!!args.sheetsDir, 'sheets directory argument (-D) is required');

  assert(fileUtils.exists(args.sourceXlsx), `spreadsheet file ${args.sourceXlsx} not found`);
  assert(fileUtils.exists(args.sheetsDir), `sheets directory ${args.sheetsDir} not found`);
};

const run = async (args) => {
  validateArgs(args);

  console.log(`Export...\n loading workbook: ${args.sourceXlsx}`);
  const converter = new ccdUtils.SpreadsheetConvert(args.sourceXlsx);
  const sheets = args._.length > 0 ? args._ : converter.allSheets();

  for (const sheet of sheets) {
    const jsonFilePath = path.join(args.sheetsDir, `${sheet}.json`);
    console.log(` converting sheet to JSON: ${sheet} => ${jsonFilePath}`);
    const json = await converter.sheet2Json(sheet);
    jsonUtil.convertPropertyValueDateToString('LiveFrom', json);
    jsonUtil.convertPropertyValueDateToString('LiveTo', json);
    await fileUtils.writeJson(jsonFilePath, jsonUtil.stringify(json));
  }

  console.log('done.');
};

module.exports = run;
