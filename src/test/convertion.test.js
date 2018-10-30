const assert = require('assert');
const sheetUtils = require('../main/lib/ccd-spreadsheet-utils');

describe('JsonHelper', () => {
  const createJsonWithNumbers = () => [
    { 'LiveFrom': 42736, 'LiveTo': 42736, 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': 42736, 'ID': 1, 'Name': 'name' }
  ];
  const createJsonWithStrings = () => [
    { 'LiveFrom': '01/01/2017', 'LiveTo': '01/01/2017', 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': '01/01/2017', 'ID': 1, 'Name': 'name' }
  ];

  describe('dateFieldToString', () => {
    it('should convert date fields from number to string', async () => {
      const json = createJsonWithNumbers();
      sheetUtils.JsonHelper.convertPropertyValueDateToString('LiveFrom', json);
      sheetUtils.JsonHelper.convertPropertyValueDateToString('LiveTo', json);
      assert.deepEqual(json, createJsonWithStrings());
    });
  });

  describe('stringToDateField', () => {
    it('should convert date fields from string to number', async () => {
      const json = createJsonWithStrings();
      sheetUtils.JsonHelper.convertPropertyValueStringToDate('LiveFrom', json);
      sheetUtils.JsonHelper.convertPropertyValueStringToDate('LiveTo', json);
      assert.deepEqual(json, createJsonWithNumbers());
    });
  });
});
