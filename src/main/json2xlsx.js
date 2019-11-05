const path = require('path');
const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');
const stringUtils = require('./lib/string-utils');
const sheetUtils = require('./lib/sheet-utils');
const { Substitutor } = require('./lib/substitutor');

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

  const excludedFilenamePatterns = args.excludedFilenamePatterns ?
    stringUtils.split(args.excludedFilenamePatterns) : [];

  const paths = await fileUtils.getJsonFilePaths(args.sheetsDir, excludedFilenamePatterns);
  const sheetToFragmentsMap = sheetUtils.groupToSheets(paths);

  for (const sheetName in sheetToFragmentsMap) {
    const readSheetData = async (relativeFilePath) => fileUtils.readJson(
      path.join(args.sheetsDir, relativeFilePath), Substitutor.injectEnvironmentVariables);

    const readSheetDataFromFragments = async (rootSheetName, filesFragments) => {
      const jsonFragments = await Promise.all(
        filesFragments.map(fileFragment => readSheetData(`${rootSheetName}/${fileFragment}`)));
      return jsonFragments.flat();
    };

    console.log(`  importing sheet data from ${sheetName} ${sheetName.indexOf('.json') === -1 ? 'directory' : 'file'}`);

    const json = await (sheetToFragmentsMap[sheetName].length === 0 ?
      readSheetData(sheetName) : readSheetDataFromFragments(sheetName, sheetToFragmentsMap[sheetName]));
    ccdUtils.JsonHelper.convertPropertyValueStringToDate('LiveFrom', json);
    ccdUtils.JsonHelper.convertPropertyValueStringToDate('LiveTo', json);
    builder.updateSheetDataJson(path.basename(sheetName, '.json'), json);
  }

  console.log(` saving workbook: ${args.destinationXlsx}`);
  await builder.saveAsAsync(args.destinationXlsx);

  console.log('done.');
};

module.exports = run;
