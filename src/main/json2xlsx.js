const assert = require('assert')

const fileUtils = require('./lib/file-utils')
const ccdUtils = require('./lib/ccd-spreadsheet-utils')
const cmdLineUtils = require('./lib/command-line-utils')

const log = ccdUtils.log

const forEachAsync = (list, asyncFn) => Promise.all(list.map(asyncFn))

const start = async () => {
  var options = new cmdLineUtils.Options()

  //validate the options
  var sourceXlsx = options.templatePath
  if (!options.useTemplate) {
    sourceXlsx = options.sourceXlsx
    assert(options.sourceXlsx, 'source spreadsheet not set')
  }
  assert(fileUtils.exists(sourceXlsx), 'source spreadsheet not found ' + sourceXlsx)
  assert(options.destXlsx, 'destination spreadsheet not set')

  log('Import...\n loading workbook: ' + sourceXlsx);
  var ccdBuilder = new ccdUtils.SpreadsheetBuilder(sourceXlsx)
  await ccdBuilder.loadAsync()

  let sheets
  if (options.clear) {
    sheets = options.all ? ccdBuilder.allSheets().map(s => s.name()) : options.sheets

    await forEachAsync(sheets, async (sheetName) => {
      log('  clearing sheet: ' + sheetName)
      ccdBuilder.clearSheetData(sheetName)
    })
  } else {
    sheets = options.sheets;
    if (options.all) {
      sheets = fileUtils
        .listJsonFilesInFolder(options.sheetsDir)
        .map((filename) => filename.slice(0, -5))
    }

    await forEachAsync(sheets, async (sheetName) => {
      var jsonPath = options.sheetsDir + sheetName + '.json';
      log('  importing sheet data: ' + jsonPath)
      ccdBuilder.updateSheetDataJson(sheetName, await fileUtils.readJson(jsonPath))
    })
  }

  log(' saving workbook: ' + options.destXlsx)
  await ccdBuilder.saveAsAsync(options.destXlsx);

  log('done.')
}

start().catch(err => log(err.toString()))
