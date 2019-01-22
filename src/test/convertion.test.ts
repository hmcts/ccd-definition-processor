import * as assert from 'assert'
import * as sheetUtils from 'lib/ccd-spreadsheet-utils'

import { Json } from 'types/json'

describe('JsonHelper', () => {
  const createJsonWithNumbers = (): Json[] => [
    { 'LiveFrom': 42736, 'LiveTo': 42736, 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': 42736, 'ID': 1, 'Name': 'name' }
  ]
  const createJsonWithStrings = (): Json[] => [
    { 'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': '01/01/2017', 'ID': 1, 'Name': 'name' }
  ]

  describe('dateFieldToString', () => {
    it('should convert date fields from number to string', async () => {
      const json: Json[] = createJsonWithNumbers()
      sheetUtils.JsonHelper.convertPropertyValueDateToString('LiveFrom', json)
      sheetUtils.JsonHelper.convertPropertyValueDateToString('LiveTo', json)
      assert.deepStrictEqual(json, createJsonWithStrings())
    })
  })

  describe('stringToDateField', () => {
    it('should convert date fields from string to number', async () => {
      const json: Json[] = createJsonWithStrings()
      sheetUtils.JsonHelper.convertPropertyValueStringToDate('LiveFrom', json)
      sheetUtils.JsonHelper.convertPropertyValueStringToDate('LiveTo', json)
      assert.deepStrictEqual(json, createJsonWithNumbers())
    })
  })
})
