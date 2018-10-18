const assert = require('assert');
const XLSX = require('xlsx');
const stringify = require('json-stringify-pretty-compact')
const XlsxPopulate = require('xlsx-populate')

const fileUtils = require('./file-utils')

// SpreadsheetConvert
//   A class to export the contents of an existing xlsx
//   each sheet in the spreadsheet can be exported as a json file
class SpreadsheetConvert {

  constructor(filename) {
    this.workbook = XLSX.readFile(filename)
    assert(this.workbook, 'could not load ' + filename)
    this.sheets = Object.keys(this.workbook.Sheets)
    this.filename = filename
  }

  async sheet2Json(sheetName, jsonFilePath) {
    var worksheet = this.workbook.Sheets[sheetName]
    assert(worksheet, 'sheet named \'' + sheetName + '\' dose not exist in ' + this.filename)

    this._setSheetRange(worksheet, 2)
    var json = this._sheet2Json(worksheet)

    await fileUtils.writeJson(jsonFilePath, json)
  }

  allSheets() {
    return this.sheets
  }

  _sheet2Json(worksheet) {
    return stringify(XLSX.utils.sheet_to_json(worksheet), { maxLength: 420, indent: 2 })
  }

  _setSheetRange(worksheet, startRow) {
    var range = XLSX.utils.decode_range(worksheet['!ref'])
    range.s.r = startRow
    worksheet['!ref'] = XLSX.utils.encode_range(range)
  }
}

//  SpreadsheetBuilder
//    A class to update the contents of an existing xlsx
class SpreadsheetBuilder {

  constructor(filename) {
    this.filename = filename
  }

  clearSheetData(sheetName) {
    var sheet = this.workbook.sheet(sheetName)
    assert(sheet, 'sheet ' + sheetName + ' not found in workbook '+this.filename)
    sheet.range('A4:Z1000').clear();
  }

  updateSheetDataJson(sheetName, json) {
    var sheet = this.workbook.sheet(sheetName)
    sheet.range('A4:Z1000').clear();
    var headers = sheet.range('A3:AZ3').value()[0].filter(el => !!el);
    var table = json.map(record => {
      return headers.map(key => {
        var data = record[key];
        return data ? data : null;
      });
    });
    sheet.cell('A4').value(table);
  }

  allSheets() {
    return this.workbook.sheets()
  }

  async loadAsync() {
    this.workbook = await XlsxPopulate.fromFileAsync(this.filename)
  }

  saveAsAsync(newFilename) {
    this.workbook.toFileAsync(newFilename)
  }

  saveAsync() {
    this.workbook.toFileAsync(this.filename)
  }
}

const log = (out) => console.log(out)

module.exports = { SpreadsheetBuilder, SpreadsheetConvert, log }
