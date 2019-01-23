import * as assert from 'assert'
import * as XlsxPopulate from 'xlsx-populate'

import { Json } from 'types/json'

/**
 * A class to build the contents of an existing xlsx.
 *
 * It is designed to start with embedded template that gets enriched with data from JSON.
 * When workbook is ready it can be saved to xlsx file.
 *
 * Note: A class should not be used with xlsx files other than CCD definitions
 * as it contains some logic specific to the format of CCD definitions.
 */
export class SpreadsheetBuilder {
  private workbook: XlsxPopulate.Workbook | undefined

  /**
   * Loads predefined template xlsx file containing empty CCD definitions with column headers only.
   */
  async loadTemplate (): Promise<void> {
    this.workbook = await XlsxPopulate.fromFileAsync('./data/ccd-template.xlsx')
  }

  /**
   * Populates specified worksheet with data from JSON files.
   *
   * Method starts writing data with third row to not override column headers.
   *
   * @param sheetName
   * @param json
   */
  populateSheet (sheetName: string, json: Json[]): void {
    assert(this.workbook, 'Workbook is not initialised, have you loaded template first?')

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

  /**
   * Saves prepared workbook into new file.
   *
   * @param path
   */
  saveAs (path: string): Promise<void> {
    assert(this.workbook, 'Workbook is not initialised, have you loaded template first?')

    return this.workbook!.toFileAsync(path)
  }
}
