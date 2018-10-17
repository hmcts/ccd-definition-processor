const fUtils = require("./lib/file-utils")
const ccdUtils = require('./lib/ccd-spreadsheet-utils')
const clUtils = require('./lib/command-line-utils')
const assert = require("assert")
const log = ccdUtils.log

const forEachAsync = (list, asyncFn) => Promise.all(list.map(asyncFn))
const start = async () => {
    var options = new clUtils.Options()

    //validate the options
    var sourceXlsx = options.templatePath
    if (!options.useTemplate) {
        sourceXlsx = options.sourceXlsx
        assert(options.sourceXlsx, "source spreadsheet not set")
    }
    assert(fUtils.exists(sourceXlsx), "source spreadsheet not found " + sourceXlsx)
    assert(options.destXlsx, "destination spreadsheet not set")

    log("Import...\n loading workbook: " + sourceXlsx);
    var ccdBuilder = new ccdUtils.SpreadsheetBuilder(sourceXlsx)
    await ccdBuilder.loadAsync()

    if (options.clear) {
        var sheets = options.all ? ccdBuilder.allSheets().map(s => s.name()) : options.sheets

        await forEachAsync(sheets, async (sheetName) => {
            log("  clearing sheet: " + sheetName)
            ccdBuilder.clearSheetData(sheetName)
        })
    } else {
        var sheets = options.sheets;
        if (options.all) {
            sheets = fUtils
                .listJsonFilesInFolder(options.sheetsDir)
                .map((filename) => filename.slice(0, -5))
        }

        await forEachAsync(sheets, async (sheetName) => {
            var jsonPath = options.sheetsDir + sheetName + ".json";
            log("  importing sheet data: " + jsonPath)
            ccdBuilder.updateSheetDataJson(sheetName, await fUtils.readJson(jsonPath))
        })
    }

    log(" saving workbook: " + options.destXlsx)
    await ccdBuilder.saveAsAsync(options.destXlsx);

    log("done.")
}

start().catch(err => log(err.toString()))
//start().catch(err => log(err))
