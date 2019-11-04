const assert = require('assert');
const XLSX = require('xlsx');

const run = require('../main/json2xlsx');

const sheetNames = [
  'AuthorisationCaseEvent',
  'AuthorisationCaseField',
  'AuthorisationCaseState',
  'AuthorisationCaseType',
  'CaseEvent',
  'CaseEventToComplexTypes',
  'CaseEventToFields',
  'CaseField',
  'CaseRoles',
  'CaseType',
  'CaseTypeTab',
  'ComplexTypes',
  'FixedLists',
  'Jurisdiction',
  'SearchAlias',
  'SearchInputFields',
  'SearchResultFields',
  'State',
  'UserProfile',
  'WorkBasketInputFields',
  'WorkBasketResultFields'
];

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
    process.env.CCD_DEF_BASE_URL = 'http://localhost';

    it('should throw an error when json file does not have a matching sheet in the template spreadsheet', async () => {
      try {
        await run({
          _: ['unexpected'],
          sheetsDir: './src/test/fixtures/jsonErrorCaseDefinitions',
          destinationXlsx: './temp/ccd-definitions.xlsx'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: Unexpected spreadsheet data file "unexpected.json"');
      }
    });

    it('should create XLSX file from JSON fixtures', async () => {
      await run({
        sheetsDir: './src/test/fixtures/jsonDefinitions',
        destinationXlsx: './temp/ccd-definitions.xlsx'
      });

      const sheets = XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets;
      assert(Object.keys(sheets).length > 0, 'No sheets have been created');

      sheetNames.forEach(sheetName => {
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${sheetName} exists`);
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

    it('should create XLSX file from JSON fixtures with exclusions', async () => {
      await run({
        sheetsDir: './src/test/fixtures/jsonDefinitionsWithExclusions',
        destinationXlsx: './temp/ccd-definitions.xlsx',
        excludedFilenamePatterns: 'UserProfile.json,*-nonprod.json'
      });

      const sheets = XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets;
      assert(Object.keys(sheets).length > 0, 'No sheets have been created');

      sheetNames.forEach(sheetName => {
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${sheetName} exists`);
        if (sheetName === 'AuthorisationCaseField') { // AuthorisationCaseField tab uniquely is build from JSON fragments
          assert.equal(sheets[sheetName]['E5'], undefined, 'Solicitor entry should be excluded from the output XLSX file');
        }
        if (sheetName === 'UserProfile') { // UserProfile values should be excluded
          assert.equal(sheets[sheetName]['C4'], undefined, `User email should be excluded from the ${sheetName} sheet`);
        }
      });
    });

    it('should create XLSX file from JSON fixtures from arbitrarily deep main directories', async () => {
      await run({
        sheetsDir: './src/test/fixtures/deepJsonDefinitions',
        destinationXlsx: './temp/ccd-definitions.xlsx'
      });

      const sheets = XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets;
      assert(Object.keys(sheets).length > 0, 'No sheets have been created');

      sheetNames.forEach(sheetName => {
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${sheetName} exists`);
        if (sheetName === 'CaseEvent') { // CaseEvent is made from json files in many sub directories
          assert.equal(sheets[sheetName]['I4'].v, '*', `Unexpected value found in I4 cell of ${sheetName} sheet`);
          assert.equal(sheets[sheetName]['I5'].v, '1_Initiation', `Unexpected value found in I5 cell of ${sheetName} sheet`);
          assert.equal(sheets[sheetName]['I6'].v, '2_Submitted', `Unexpected value found in I6 cell of ${sheetName} sheet`);
          assert.equal(sheets[sheetName]['I7'].v, '1_Initiation', `Unexpected value found in I7 cell of ${sheetName} sheet`);
        }
      });
    });
  });
});
