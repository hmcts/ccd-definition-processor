const assert = require('assert');
const XLSX = require('xlsx');
const stringify = require('json-stringify-pretty-compact');
const XlsxPopulate = require('xlsx-populate');

const fileUtils = require('./file-utils');

// SpreadsheetConvert
//   A class to export the contents of an existing xlsx
//   each sheet in the spreadsheet can be exported as a json file
class SpreadsheetConvert {

  constructor(filename) {
    this.workbook = XLSX.readFile(filename);
    assert(this.workbook, 'could not load ' + filename);
    this.sheets = Object.keys(this.workbook.Sheets);
    this.filename = filename;
  }

  async sheet2Json(sheetName, jsonFilePath) {
    const worksheet = this.workbook.Sheets[sheetName];
    assert(worksheet, 'sheet named \'' + sheetName + '\' dose not exist in ' + this.filename);

    this._setSheetRange(worksheet, 2);
    const json = this._sheet2Json(worksheet);

    await fileUtils.writeJson(jsonFilePath, json);
  }

  allSheets() {
    return this.sheets;
  }

  _sheet2Json(worksheet) {
    return stringify(XLSX.utils.sheet_to_json(worksheet), { maxLength: 420, indent: 2 });
  }

  _setSheetRange(worksheet, startRow) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    range.s.r = startRow;
    worksheet['!ref'] = XLSX.utils.encode_range(range);
  }
}

//  SpreadsheetBuilder
//    A class to update the contents of an existing xlsx
class SpreadsheetBuilder {

  constructor(filename) {
    this.filename = filename;
  }

  updateSheetDataJson(sheetName, json) {
    const sheet = this.workbook.sheet(sheetName);
    const headers = sheet.range('A3:AZ3').value()[0].filter(el => !!el);
    const table = json.map(record => {
      return headers.map(key => {
        const data = record[key];
        return data ? data : null;
      });
    });
    sheet.cell('A4').value(table);
  }

  allSheets() {
    return this.workbook.sheets();
  }

  async loadAsync() {
    this.workbook = await XlsxPopulate.fromFileAsync(this.filename);
  }

  async saveAsAsync(newFilename) {
    await this.workbook.toFileAsync(newFilename);
  }
}

module.exports = { SpreadsheetBuilder, SpreadsheetConvert };
