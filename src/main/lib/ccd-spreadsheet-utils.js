const assert = require('assert');
const XLSX = require('xlsx');
const stringify = require('json-stringify-pretty-compact');
const XlsxPopulate = require('xlsx-populate');
const moment = require('moment');

// SpreadsheetConvert
//   A class to export the contents of an existing CCD definition xlsx
//   each sheet in the spreadsheet can be exported as a json file
class SpreadsheetConvert {

  constructor (filename) {
    this.workbook = XLSX.readFile(filename);
    assert(this.workbook, 'could not load ' + filename);
    this.sheets = Object.keys(this.workbook.Sheets);
    this.filename = filename;
  }

  async sheet2Json (sheetName) {
    const worksheet = this.workbook.Sheets[sheetName];
    assert(worksheet, 'sheet named \'' + sheetName + '\' dose not exist in ' + this.filename);

    this._setSheetRange(worksheet, 2);
    return XLSX.utils.sheet_to_json(worksheet);
  }

  allSheets () {
    return this.sheets;
  }

  _setSheetRange (worksheet, startRow) {
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    range.s.r = startRow;
    worksheet['!ref'] = XLSX.utils.encode_range(range);
  }
}

//  SpreadsheetBuilder
//    A class to update the contents of an existing xlsx
class SpreadsheetBuilder {

  constructor (filename) {
    this.filename = filename;
  }

  updateSheetDataJson (sheetName, json) {
    const sheet = this.workbook.sheet(sheetName);
    assert(sheet, `Unexpected spreadsheet data file "${sheetName}.json"`);
    const headers = sheet.range('A3:AZ3').value()[0].filter(el => !!el);
    if (json.length > 0) {
      const table = json.map(record => {
        return headers.map(key => {
          const data = record[key];
          return data || data === 0 ? data : null;
        });
      });
      sheet.cell('A4').value(table);
    }
  }

  allSheets () {
    return this.workbook.sheets();
  }

  async loadAsync () {
    this.workbook = await XlsxPopulate.fromFileAsync(this.filename);
  }

  saveAsAsync (newFilename) {
    return this.workbook.toFileAsync(newFilename);
  }
}

const dateFormat = 'DD/MM/YYYY';

class JsonHelper {

  static convertPropertyValueDateToString (propertyName, json) {
    json.forEach(obj => {
      if (obj[propertyName]) {
        const date = moment(XlsxPopulate.numberToDate(obj[propertyName]));
        obj[propertyName] = date.format(dateFormat);
      }
    });
  }

  static convertPropertyValueStringToDate (propertyName, json) {
    json.forEach(obj => {
      if (obj[propertyName]) {
        const dateString = obj[propertyName];
        const date = moment(dateString, dateFormat).toDate();
        obj[propertyName] = XlsxPopulate.dateToNumber(date);
      }
    });
  }

  static stringify (json) {
    return stringify(json, { maxLength: 420, indent: 2 });
  }

}

module.exports = { SpreadsheetBuilder, SpreadsheetConvert, JsonHelper };
