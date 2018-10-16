const files = require("./lib/files")
const stringify = require("json-stringify-pretty-compact")
const XLSX = require('xlsx');
const cmdLine = require('./lib/command-line-parse')

const log = (out) => console.log(out)
const sheet2Json = (worksheet) => stringify(XLSX.utils.sheet_to_json(worksheet), { maxLength: 420, indent: 2 })
const loadWorkbook = (filename) => XLSX.readFile(filename)

const setSheetRange = (worksheet, startRow) => {
	var range = XLSX.utils.decode_range(worksheet['!ref'])
	range.s.r = startRow
	worksheet['!ref'] = XLSX.utils.encode_range(range)
}

const extractSheet = async (sheetname, sheetDir, workbook) => {
	var outname = sheetDir + sheetname + ".json"
	var worksheet = workbook.Sheets[sheetname]
	setSheetRange(worksheet, 2)
	var json = sheet2Json(worksheet)
	await files.writeJson(outname, json)
}

const exportSheets = async () => {
	var cmdargs = new cmdLine.ParsedCmdLine()

	if (!cmdargs.valid) {
		log('invlid command line arguments')
		return
	}

	log("Export...")
	log(" loading workbook: " + cmdargs.filename)
	var workbook = loadWorkbook(cmdargs.filename)

	if (cmdargs.all) {
		sheets = Object.keys(workbook.Sheets)
	}

	await Promise.all(sheets.map(async sheetname => {
		log(" saving sheet: " + sheetname + ".json")
		await extractSheet(sheetname, cmdargs.sheetsDir, workbook)
	}))

	log("done.")
}

exportSheets()
