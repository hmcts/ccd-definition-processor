const path = require('path');
const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');
const stringUtils = require('./lib/string-utils');
const { Substitutor } = require('./lib/substitutor');

const sourceXlsx = './data/ccd-template.xlsx';

const validateArgs = (args) => {
  assert(!!args.sheetsDir, 'sheets directory argument (-D) is required');
  assert(!!args.destinationXlsx, 'spreadsheet file argument (-o) is required');

  assert(fileUtils.exists(args.sheetsDir),
    `sheets directory ${args.sheetsDir} not found`);
};

const run = async (args) => {
  validateArgs(args);

  console.log(`Import...\n loading workbook: ${sourceXlsx}`);
  const builder = new ccdUtils.SpreadsheetBuilder(sourceXlsx);
  await builder.loadAsync();

  let excludedFilenamePatterns = args.excludedFilenamePatterns
    ? stringUtils.split(args.excludedFilenamePatterns) : [];

  let fileMap = await fileUtils.getJsonFiles(args.sheetsDir,
    excludedFilenamePatterns);

  for (const file in fileMap) {
    if (Object.prototype.hasOwnProperty.call(fileMap, file)) {
      console.log(
        `  importing sheet data from ${file} ${file.indexOf('.json') === -1
          ? 'directory' : 'file'}`);

      const json = await readSheetData(fileMap, file, args.sheetsDir);
      ccdUtils.JsonHelper.convertPropertyValueStringToDate('LiveFrom', json);
      ccdUtils.JsonHelper.convertPropertyValueStringToDate('LiveTo', json);
      builder.updateSheetDataJson(path.basename(file, '.json'), json);
    }
  }

  console.log(` saving workbook: ${args.destinationXlsx}`);
  await builder.saveAsAsync(args.destinationXlsx);

  console.log('done.');
};

async function readSheetData (fileMap, file, sheetDirectory) {
  const readJsonFile = (sheetDirectory, relativeFilePath) => fileUtils.readJson(
    path.join(sheetDirectory, relativeFilePath),
    Substitutor.injectEnvironmentVariables);

  if (fileMap[file].length === 0) {
    return readJsonFile(sheetDirectory, file);
  } else {
    let files = fileMap[file];
    const jsonFragments = await Promise.all(
      files.map(fileFragment => readJsonFile(sheetDirectory,
        `${file}/${fileFragment}`)));
    return jsonFragments.flat();
  }
}

module.exports = run;
