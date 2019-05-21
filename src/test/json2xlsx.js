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

    it('should throw an error when json file does not have a matching sheet in the template spreadsheet', async () => {
      try {
        const jsonDefinitionsFolder = './src/test/fixtures/jsonErrorCaseDefinitions';
        await run({
          _: ['unexpected'],
          sheetsDir: jsonDefinitionsFolder,
          destinationXlsx: './temp/ccd-definitions.xlsx'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: Unexpected spreadsheet data file "unexpected.json"');
      }
    });

    it('should create XLSX file from JSON fixtures', async () => {
      process.env.CCD_DEF_BASE_URL = 'http://localhost';

      const jsonDefinitionsFolder = './src/test/fixtures/jsonDefinitions';
      await run({
        _: [],
        sheetsDir: jsonDefinitionsFolder,
        destinationXlsx: './temp/ccd-definitions.xlsx'
      });

      const sheets = XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets;
      assert(Object.keys(sheets).length > 0, 'No sheets have been created');

      const files = fileUtils.listJsonFilesInFolder(jsonDefinitionsFolder);
      asyncUtils.forEach(files, file => {
        const sheetName = file.slice(0, -5);
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${file} exists`);
        assert.equal(sheets[sheetName]['A4'].v, 42736, `Unexpected value found in A4 cell of ${sheetName} sheet`);
        assert.equal(sheets[sheetName]['B4'], undefined, `Unexpected value found in A4 cell of ${sheetName} sheet`);
        if (sheetName === 'CaseEvent') {
          assert.equal(sheets[sheetName]['N4'].v, 'http://localhost/initiate/callback', `Unexpected value found in N4 cell of ${sheetName} sheet`);
          assert.equal(sheets[sheetName]['N5'].v, 'http://localhost/submit/callback', `Unexpected value found in N4 cell of ${sheetName} sheet`);
        }
        if (sheetName === 'FixedLists') {
          assert.equal(sheets[sheetName]['D5'].v, 0, `Missing zero value in ${sheetName} sheet`);
        }
      });
    });
  });
});
