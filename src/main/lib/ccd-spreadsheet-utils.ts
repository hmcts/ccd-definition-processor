import * as assert from 'assert'
import * as XLSX from 'xlsx'
import * as XlsxPopulate from 'xlsx-populate'

import { Json } from 'types/json'

function setSheetRange (worksheet: XLSX.WorkSheet, startRow: number): void {
  const range: XLSX.Range = XLSX.utils.decode_range(worksheet['!ref'] as string)
  range.s.r = startRow
  worksheet['!ref'] = XLSX.utils.encode_range(range)
}

/**
 * A class to export the contents of an existing CCD definition xlsx
 * each sheet in the spreadsheet can be exported as a json file
 */
export class SpreadsheetConvert {
  workbook: XLSX.WorkBook

  constructor (private filename: string) {
    this.workbook = XLSX.readFile(filename)
    assert(this.workbook, `could not load ${filename}`)
  }

  sheet2Json (sheetName: string): Json[] {
    const worksheet: XLSX.WorkSheet = this.workbook.Sheets[sheetName]
    assert(worksheet, `sheet named '${sheetName}' does not exist in ${this.filename}`)

    setSheetRange(worksheet, 2)

    return XLSX.utils.sheet_to_json(worksheet)
  }

  allSheets (): string[] {
    return Object.keys(this.workbook.Sheets)
  }
}

/**
 * A class to update the contents of an existing xlsx
 */
export class SpreadsheetBuilder {
  workbook: XlsxPopulate.Workbook | undefined

  updateSheetDataJson (sheetName: string, json: Json[]): void {
    assert(this.workbook, 'workbook is undefined')

    const sheet: XlsxPopulate.Sheet | undefined = this.workbook!.sheet(sheetName)
    assert(sheet, `Unexpected spreadsheet data file "${sheetName}.json"`)
    const headers: string[] = sheet!.range('A3:AZ3').value()[0].filter((value: any) => !!value)
    if (json.length > 0) {
      const table = json.map((record: Json) => {
        return headers.map((key: string) => {
          const data = record[key]
          return data ? data : null
        })
      })
      sheet!.cell('A4').value(table)
    }
  }

  async loadAsync (): Promise<void> {
    this.workbook = await XlsxPopulate.fromFileAsync('./data/ccd-template.xlsx')
  }

  saveAsAsync (path: string): Promise<void> {
    assert(this.workbook, 'workbook is undefined')

    return this.workbook!.toFileAsync(path)
  }
}
