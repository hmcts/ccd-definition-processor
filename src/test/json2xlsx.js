const assert = require('assert');
const XLSX = require('xlsx');

const run = require('../main/json2xlsx');

const fileUtils = require('../main/lib/file-utils');
const asyncUtils = require('../main/lib/async-utils');

describe('json2xlsx', () => {
  describe('validation', () => {
    it('should throw an error when sheets directory argument is not provided', async () => {
      try {
        await run({
          _: [],
          sheetsDir: '',
          destinationXlsx: './temp/ccd-definitions.xlsx'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: sheets directory argument (-D) is required');
      }
    });

    it('should throw an error when spreadsheet file argument is not provided', async () => {
      try {
        await run({
          _: [],
          sheetsDir: './temp',
          destinationXlsx: ''
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: spreadsheet file argument (-o) is required');
      }
    });
  });

  describe('outcome', () => {
    it('should create XLSX file from JSON fixtures', async () => {
      await run({
        _: [],
        sheetsDir: './src/test/fixtures',
        destinationXlsx: './temp/ccd-definitions.xlsx'
      });

      const sheets = XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets;
      assert(Object.keys(sheets).length > 0, 'No sheets have been created');

      const files = fileUtils.listJsonFilesInFolder('./src/test/fixtures');
      asyncUtils.forEach(files, file => {
        const sheetName = file.slice(0, -5);
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${file} exists`);
        assert.equal(sheets[sheetName]['A4'].v, 42736, `Unexpected value found in A4 cell of ${sheetName} sheet`);
        assert.equal(sheets[sheetName]['B4'], undefined, `Unexpected value found in A4 cell of ${sheetName} sheet`);
      });
    });
  });
});
