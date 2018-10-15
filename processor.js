
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const stringify = require("json-stringify-pretty-compact")
const XLSX = require('xlsx');
const XlsxPopulate = require('xlsx-populate');

const log = (out) => console.log(out)
const readjson = filename => {
	return new Promise((resolve) => {
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) throw err
			resolve(JSON.parse(data))
		})
	})
}
const writeJson = (filename, json) => {
	return new Promise((resolve) => {
		fs.writeFile(filename, json, (err) => {
			if (err) throw err
			resolve()
		})
	})
}

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
	await writeJson(outname, json);
}

//XlsxPopulate - import
const importSheetData = (sheet, json) => {
	sheet.range("A4:Z1000").clear();
	var headers = sheet.range("A3:AZ3").value()[0].filter(el => !!el);
	var table = json.map(record => {
		return headers.map(key => {
			var data = record[key];
			return data ? data : null;
		});
	});
	sheet.cell("A4").value(table);
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
		var workbook = await XlsxPopulate.fromFileAsync(filename)

		await Promise.all(sheets.map( async sheetname => {
			var path = sheetsDir + sheetname + ".json"
			console.log("  importing sheet data: " + path);
			var json = await readjson(path)
			const sheet = workbook.sheet(sheetname);
			importSheetData(sheet, json);
		}))

		log(" saving workbook: " + filename)
		await workbook.toFileAsync(filename)
	}
	log("done.")
}


start(argv)









