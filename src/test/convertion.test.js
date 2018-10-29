const assert = require('assert');
const sheetUtils = require('../main/lib/ccd-spreadsheet-utils');

describe('JsonHelper', () => {
  const createJsonWithNumbers = () => [
    { 'LiveFrom': 42736, 'LiveTo': 42736, 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': 42736, 'ID': 1, 'Name': 'name' }
  ];
  const createJsonWithStrings = () => [
    { 'LiveFrom': '2017-1-1', 'LiveTo': '2017-1-1', 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': '2017-1-1', 'ID': 1, 'Name': 'name' }
  ];

  describe('dateFieldToString', () => {
    it('should convert date fields from number to string', async () => {
      const json = createJsonWithNumbers();
      sheetUtils.JsonHelper.propertyToString('LiveFrom', json);
      sheetUtils.JsonHelper.propertyToString('LiveTo', json);
      assert.deepEqual(json, createJsonWithStrings());
    });
  });

  describe('stringToDateField', () => {
    it('should convert date fields from string to number', async () => {
      const json = createJsonWithStrings();
      sheetUtils.JsonHelper.propertyToDate('LiveFrom', json);
      sheetUtils.JsonHelper.propertyToDate('LiveTo', json);
      assert.deepEqual(json, createJsonWithNumbers());
    });
  });
});
