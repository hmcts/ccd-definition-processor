const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const asyncUtils = require('./lib/async-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');
const cmdLineUtils = require('./lib/command-line-utils');

const start = async () => {
  const options = new cmdLineUtils.Options();

  //validate the options
  let sourceXlsx = options.templatePath;
  if (!options.useTemplate) {
    sourceXlsx = options.sourceXlsx;
    assert(options.sourceXlsx, 'source spreadsheet not set');
  }
  assert(fileUtils.exists(sourceXlsx), 'source spreadsheet not found ' + sourceXlsx);
  assert(options.destXlsx, 'destination spreadsheet not set');

  console.log('Import...\n loading workbook: ' + sourceXlsx);
  const ccdBuilder = new ccdUtils.SpreadsheetBuilder(sourceXlsx);
  await ccdBuilder.loadAsync();

  let sheets;
  if (options.clear) {
    sheets = options.all ? ccdBuilder.allSheets().map(s => s.name()) : options.sheets;

    await asyncUtils.forEach(sheets, async (sheetName) => {
      console.log('  clearing sheet: ' + sheetName);
      ccdBuilder.clearSheetData(sheetName);
    });
  } else {
    sheets = options.sheets;
    if (options.all) {
      sheets = fileUtils
        .listJsonFilesInFolder(options.sheetsDir)
        .map((filename) => filename.slice(0, -5));
    }

    await asyncUtils.forEach(sheets, async (sheetName) => {
      const jsonPath = options.sheetsDir + sheetName + '.json';
      console.log('  importing sheet data: ' + jsonPath);
      ccdBuilder.updateSheetDataJson(sheetName, await fileUtils.readJson(jsonPath));
    });
  }

  console.log(' saving workbook: ' + options.destXlsx);
  await ccdBuilder.saveAsAsync(options.destXlsx);

  console.log('done.');
};

start().catch(err => console.log(err.toString()));
