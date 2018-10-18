const assert = require('assert');

const cmdLineParser = require('./lib/command-line-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');
const fileUtils = require('./lib/file-utils');

const convert = async () => {
  var options = new cmdLineParser.Options();
  assert(fileUtils.exists(options.sourceXlsx), 'spreadsheet not found ' + options.sourceXlsx);

  console.log('Export...\n loading workbook: ' + options.sourceXlsx);
  var converter = new ccdUtils.SpreadsheetConvert(options.sourceXlsx);
  var sheets = options.all ? converter.allSheets() : options.sheets;

  await Promise.all(sheets.map(async sheetName => {
    var jsonFilePath = options.sheetsDir + sheetName + '.json';
    console.log(' converting sheet to Json: ' + sheetName + ' => ' + jsonFilePath);
    await converter.sheet2Json(sheetName, jsonFilePath);
  }));

  console.log('done.');
};

convert().catch((err) => console.log(err.toString()));
