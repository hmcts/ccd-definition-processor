const files = require("./lib/files")
const ccdDef = require('./lib/modify-ccd-definition')
const cmdLine = require('./lib/command-line-parse')
const log = (out) => console.log(out)

const start = async () => {
    var cmdline = new cmdLine.ParsedCmdLine()
    if (!cmdline.valid) {
        log("invalid command line")
        return
    }

    log("Import...\n loading workbook: " + cmdline.filename);
    var ccdFile = new ccdDef.DefinitionFile(cmdline.filename)
    await ccdFile.loadAsync()

    var sheets = cmdline.sheets
    if (cmdline.all && cmdline.sheetsDir) {
        sheets = files
            .folderJsonFiles(cmdline.sheetsDir)
            .map((filename) => filename.slice(0, -5))
    }

    await Promise.all(sheets.map(async sheetname => {
        var path = cmdline.sheetsDir + sheetname + ".json"
        console.log("  importing sheet data: " + path);
        var json = await files.readJson(path)
        ccdFile.updateSheetDataJson(sheetname, json);
    }))

    log(" saving workbook: " + cmdline.filename)
    await ccdFile.saveAsync();

    log("done.")
}


start()













