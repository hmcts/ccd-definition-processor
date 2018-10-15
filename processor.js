const files = require( "./lib/files")
const ccdDef = require('./lib/modify-ccd-definition')

const argv = require('minimist')(process.argv.slice(2))
const stringify = require("json-stringify-pretty-compact")
const XLSX = require('xlsx');


const log = (out) => console.log(out)

//XLSX - extract
const sheet2Json = (worksheet) => stringify(XLSX.utils.sheet_to_json(worksheet), {maxLength: 400, indent: 2})
const loadWorkbook = (filename) => XLSX.readFile(filename)
const setSheetRange = (worksheet, startRow) => {
	var range = XLSX.utils.decode_range(worksheet['!ref']);
	range.s.r = startRow;
	worksheet['!ref'] = XLSX.utils.encode_range(range);
}
const extractSheet = async (sheetname, sheetDir, workbook) => {
	var outname = sheetDir + sheetname + ".json";
	var worksheet = workbook.Sheets[sheetname]
	setSheetRange(worksheet, 2)
	var json = sheet2Json(worksheet);
	await files.writeJson(outname, json);
}

const start = async (args) => {
	var sheets = args._
	var filename = args.f
	var exportSheets = args.e
	var all = args.a
	var sheetsDir = args.d ? args.d : ""

	if (!filename) return

	if (exportSheets) {
		log("Export...")
		log(" loading workbook: " + filename);
		var workbook = loadWorkbook(filename)

		if (all) {
			sheets = Object.keys(workbook.Sheets)
		}
		await Promise.all(sheets.map(async sheetname => {
			log(" saving sheet: " + sheetname + ".json");
			await extractSheet(sheetname, sheetsDir, workbook);
		}))
	} else {
		log("Import...")
		log(" loading workbook: " + filename);
		var ccdFile = new ccdDef.DefinitionFile(filename)
		await ccdFile.loadAsync()

		await Promise.all(sheets.map( async sheetname => {
			var path = sheetsDir + sheetname + ".json"
			console.log("  importing sheet data: " + path);
			var json = await files.readJson(path)
			ccdFile.updateSheetDataJson(sheetname, json);
		}))

		log(" saving workbook: " + filename)
		await ccdFile.saveAsync();
	}
	log("done.")
}


start(argv)













