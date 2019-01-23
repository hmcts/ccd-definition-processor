import * as assert from 'assert'
import * as XLSX from 'xlsx'

import { Json } from 'types/json'

function setSheetRange (worksheet: XLSX.WorkSheet, startRow: number): void {
  const range: XLSX.Range = XLSX.utils.decode_range(worksheet['!ref'] as string)
  range.s.r = startRow
  worksheet['!ref'] = XLSX.utils.encode_range(range)
}

/**
 * A class to read contents of an existing CCD definition xlsx.
 *
 * Note: A class should not be used with xlsx files other than CCD definitions
 * as it contains some logic specific to the format of CCD definitions.
 */
export class SpreadsheetReader {
  private readonly workbook: XLSX.WorkBook

  constructor (private filename: string) {
    this.workbook = XLSX.readFile(filename)
    assert(this.workbook, `Could not load ${filename}`)
  }

  /**
   * Returns names of worksheets found in the file.
   */
  getSheetNames (): string[] {
    return Object.keys(this.workbook.Sheets)
  }

  /**
   * Exports content of worksheet in JSON format.
   *
   * An error is thrown if worksheet does not exist.
   *
   * @param sheetName
   */
  readSheetAsJson (sheetName: string): Json[] {
    const worksheet: XLSX.WorkSheet = this.workbook.Sheets[sheetName]
    assert(worksheet, `sheet named '${sheetName}' does not exist in ${this.filename}`)

    setSheetRange(worksheet, 2)

    return XLSX.utils.sheet_to_json(worksheet)
  }
}
