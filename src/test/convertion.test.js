const assert = require('assert');
const sheetUtils = require('../main/lib/ccd-spreadsheet-utils');

describe('JsonHelper', () => {
  const jsonWithNumbers = ()=>[
    { 'LiveFrom': 42736, 'LiveTo': 42736, 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': 42736, 'LiveTo': 42736, 'ID': 1, 'Name': 'name' }
  ];
  const jsonWithStrings = ()=>[
    { 'LiveFrom': '2017-1-1', 'LiveTo': '2017-1-1', 'ID': 1, 'Name': 'name' },
    { 'LiveFrom': '2017-1-1', 'LiveTo': '2017-1-1', 'ID': 1, 'Name': 'name' }
  ];

  describe('dateFieldToString on json' , () => {
    it('should convert date fields from number to string', async () => {
      let json = jsonWithNumbers();
      sheetUtils.JsonHelper.dateFieldToString('LiveFrom', json);
      sheetUtils.JsonHelper.dateFieldToString('LiveTo', json);
      assert.deepEqual(json, jsonWithStrings());
    });
  });

  describe('stringToDateField on json', () => {
    it('should convert date fields from string to number', async () => {
      let json = jsonWithStrings();
      sheetUtils.JsonHelper.stringToDateField('LiveFrom', json);
      sheetUtils.JsonHelper.stringToDateField('LiveTo', json);
      assert.deepEqual(json, jsonWithNumbers());
    });
  });
});


