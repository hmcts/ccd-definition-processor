const path = require('path');
const assert = require('assert');

const fileUtils = require('./lib/file-utils');
const ccdUtils = require('./lib/ccd-spreadsheet-utils');
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

  const files = fileUtils.listFilesInDirectory(args.sheetsDir, args._);

  for (const file of files) {
    const readSheetData = async (file) => {
      const readJsonFile = (relativeFilePath) => {
        return fileUtils.readJson(path.join(args.sheetsDir, relativeFilePath), Substitutor.injectEnvironmentVariables);
      };

      if (file.isDirectory()) {
        const jsonFragments = await Promise.all(
          fileUtils.listFilesInDirectory(path.join(args.sheetsDir, file.name))
            .map(fragmentFile => readJsonFile(`${file.name}/${fragmentFile.name}`))
        );
        return jsonFragments.flat();
      } else {
        return await readJsonFile(file.name);
      }
    };

    console.log(`  importing sheet data from ${file.name} ${file.isDirectory() ? 'directory' : 'file'}`);
    const json = await readSheetData(file);
    ccdUtils.JsonHelper.convertPropertyValueStringToDate('LiveFrom', json);
    ccdUtils.JsonHelper.convertPropertyValueStringToDate('LiveTo', json);
    builder.updateSheetDataJson(path.basename(file.name, '.json'), json);
  }

  console.log(` saving workbook: ${args.destinationXlsx}`);
  await builder.saveAsAsync(args.destinationXlsx);

  console.log('done.');
};

module.exports = run;
