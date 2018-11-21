import * as assert from 'assert'
import * as XLSX from 'xlsx'
import * as stringify from 'json-stringify-pretty-compact'
import * as XlsxPopulate from 'xlsx-populate'
import * as moment from 'moment'

// SpreadsheetConvert
//   A class to export the contents of an existing CCD definition xlsx
//   each sheet in the spreadsheet can be exported as a json file
export class SpreadsheetConvert {
  workbook: XLSX.WorkBook
  sheets: any

  constructor (private filename: string) {
    this.workbook = XLSX.readFile(filename)
    assert(this.workbook, 'could not load ' + filename)
    this.sheets = Object.keys(this.workbook.Sheets)
  }

  async sheet2Json (sheetName: string) {
    const worksheet: XLSX.WorkSheet = this.workbook.Sheets[sheetName]
    assert(worksheet, 'sheet named \'' + sheetName + '\' dose not exist in ' + this.filename)

    this._setSheetRange(worksheet, 2)
    return XLSX.utils.sheet_to_json(worksheet)
  }

  allSheets () {
    return this.sheets
  }

  _setSheetRange (worksheet: XLSX.WorkSheet, startRow: number) {
    const range = XLSX.utils.decode_range(worksheet['!ref'] as string)
    range.s.r = startRow
    worksheet['!ref'] = XLSX.utils.encode_range(range)
  }
}

//  SpreadsheetBuilder
//    A class to update the contents of an existing xlsx
export class SpreadsheetBuilder {
  workbook: XLSX.WorkBook | undefined

  constructor (private filename: string) {
  }

  updateSheetDataJson (sheetName: string, json: object) {
    const sheet = this.workbook.sheet(sheetName)
    const headers = sheet.range('A3:AZ3').value()[0].filter(el => !!el)
    const table = json.map(record => {
      return headers.map(key => {
        const data = record[key]
        return data ? data : null
      })
    })
    sheet.cell('A4').value(table)
  }

  async loadAsync () {
    this.workbook = await XlsxPopulate.fromFileAsync(this.filename)
  }

  saveAsAsync (newFilename: string) {
    return this.workbook.toFileAsync(newFilename)
  }
}

const dateFormat = 'DD/MM/YYYY'

export class JsonHelper {

  static convertPropertyValueDateToString (propertyName: string, json: any) {
    json.forEach((obj: object) => {
      if (obj[propertyName]) {
        const date = moment(XlsxPopulate.numberToDate(obj[propertyName]))
        obj[propertyName] = date.format(dateFormat)
      }
    })
  }

  static convertPropertyValueStringToDate (propertyName: string, json: any) {
    json.forEach((obj: object) => {
      if (obj[propertyName]) {
        const dateString = obj[propertyName]
        const date = moment(dateString, dateFormat).toDate()
        obj[propertyName] = XlsxPopulate.dateToNumber(date)
      }
    })
  }

  static stringify (json: object) {
    return stringify(json, { maxLength: 420, indent: 2 })
  }

}
