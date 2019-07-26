const path = require('path');
const assert = require('assert');
const XLSX = require('xlsx');

const run = require('../main/json2xlsx');

const fileUtils = require('../main/lib/file-utils');

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

      const files = fileUtils.listFilesInDirectory(jsonDefinitionsFolder);
      files.forEach(file => {
        const sheetName = path.basename(file.name, '.json');
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${file.name} exists`);
        if (sheetName === 'AuthorisationCaseField') { // AuthorisationCaseField tab uniquely is build from JSON fragments
          assert.equal(sheets[sheetName]['E4'].v, 'caseworker', `Unexpected value found in E4 cell of ${sheetName} sheet`);
          assert.equal(sheets[sheetName]['E5'].v, 'solicitor', `Unexpected value found in E5 cell of ${sheetName} sheet`);
        }
        if (sheetName === 'CaseEvent') { // CaseEvent tab uniquely has environment variable placeholders
          assert.equal(sheets[sheetName]['N4'].v, 'http://localhost/initiate/callback', `Unexpected value found in N4 cell of ${sheetName} sheet`);
          assert.equal(sheets[sheetName]['N5'].v, 'http://localhost/submit/callback', `Unexpected value found in N4 cell of ${sheetName} sheet`);
        }
        if (sheetName === 'FixedLists') { // FixedLists tab uniquely has 0 value that should be carried though
          assert.equal(sheets[sheetName]['D5'].v, 0, `Missing zero value in ${sheetName} sheet`);
        }
        if (sheetName !== 'SearchAlias') { // SearchAlias tab uniquely does not have live from / to columns
          assert.equal(sheets[sheetName]['A4'].v, 42736, `Unexpected value found in A4 cell of ${sheetName} sheet`);
          assert.equal(sheets[sheetName]['B4'], undefined, `Unexpected value found in A4 cell of ${sheetName} sheet`);
        }
      });
    });
  });
});
