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
  'ChallengeQuestion',
  'FixedLists',
  'Jurisdiction',
  'SearchAlias',
  'SearchCasesResultFields',
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

      const assertCell = (sheetName, cell, expectedCellValue) => {
        const actualCellValue = expectedCellValue === undefined ? sheets[sheetName][cell] : sheets[sheetName][cell].v;
        assert.equal(actualCellValue, expectedCellValue, `Unexpected value found in ${cell} cell of ${sheetName} sheet`);
      };

      sheetNames.forEach(sheetName => {
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${sheetName} exists`);
        if (sheetName === 'AuthorisationCaseEvent') {
          assertCell(sheetName, 'D4', 'initiateCase');
          assertCell(sheetName, 'E4', 'caseworker');
          assertCell(sheetName, 'F4', 'CRU');

          assertCell(sheetName, 'D5', 'initiateCase2');
          assertCell(sheetName, 'E5', 'caseworker1');
          assertCell(sheetName, 'F5', 'CRU');

          assertCell(sheetName, 'D6', 'initiateCase2');
          assertCell(sheetName, 'E6', 'caseworker2');
          assertCell(sheetName, 'F6', 'CRU');

          assertCell(sheetName, 'D7', 'initiateCase3');
          assertCell(sheetName, 'E7', 'caseworker1');
          assertCell(sheetName, 'F7', 'C');

          assertCell(sheetName, 'D8', 'initiateCase3');
          assertCell(sheetName, 'E8', 'caseworker2');
          assertCell(sheetName, 'F8', 'C');

          assertCell(sheetName, 'D9', 'initiateCase3');
          assertCell(sheetName, 'E9', 'caseworker3');
          assertCell(sheetName, 'F9', 'D');
        }
        if (sheetName === 'AuthorisationCaseField') { // AuthorisationCaseField tab uniquely is build from JSON fragments

          assertCell(sheetName, 'E4', 'caseworker');
          assertCell(sheetName, 'E5', 'solicitor');
        }
        if (sheetName === 'CaseEvent') { // CaseEvent tab uniquely has environment variable placeholders
          assertCell(sheetName, 'N4', 'http://localhost/initiate/callback');
          assertCell(sheetName, 'N5', 'http://localhost/submit/callback');
          assertCell(sheetName, 'U4', 'N');
          assertCell(sheetName, 'U5', 'Y');
          assertCell(sheetName, 'V5', 'caseTitle != ""');
        }
        if (sheetName === 'CaseEventToFields') {
          assertCell(sheetName, 'C4', 'DRAFT');
          assertCell(sheetName, 'D4', 'addCaseIDReference');
          assertCell(sheetName, 'E4', 'caseIDReference');
          assertCell(sheetName, 'F4', '1');
          assertCell(sheetName, 'G4', 'OPTIONAL');
          assertCell(sheetName, 'H4', '1');
          assertCell(sheetName, 'I4', 'Add Case ID');
          assertCell(sheetName, 'R4', 'caseIDLabelOverride');
          assertCell(sheetName, 'S4', 'caseIDHintOverride');
          assertCell(sheetName, 'T4', 'Y');
          assertCell(sheetName, 'U4', 'Y');
        }
        if (sheetName === 'FixedLists') { // FixedLists tab uniquely has 0 value that should be carried though
          assertCell(sheetName, 'D5', 0);
        }
        if (sheetName === 'CaseField') {
          assertCell(sheetName, 'M3', 'Searchable');

          assertCell(sheetName, 'D4', 'caseTitle');
          assertCell(sheetName, 'E4', 'Case Title');
          assertCell(sheetName, 'G4', 'Text');
          assertCell(sheetName, 'M4', undefined);

          assertCell(sheetName, 'D5', 'caseOwner');
          assertCell(sheetName, 'E5', 'Case Owner');
          assertCell(sheetName, 'G4', 'Text');
          assertCell(sheetName, 'M5', 'Y');
        }
        if (sheetName === 'ComplexType') {
          assertCell(sheetName, 'N3', 'Searchable');

          assertCell(sheetName, 'C4', 'UploadDocument');
          assertCell(sheetName, 'D4', 'typeOfDocument');
          assertCell(sheetName, 'E4', 'Document');
          assertCell(sheetName, 'N4', undefined);

          assertCell(sheetName, 'C5', 'GenerateDocument');
          assertCell(sheetName, 'D5', 'type');
          assertCell(sheetName, 'E5', 'Text');
          assertCell(sheetName, 'N5', 'N');
          assertCell(sheetName, 'O5', 'Y');
        }
        if (sheetName !== 'SearchAlias') { // SearchAlias tab uniquely does not have live from / to columns
          assertCell(sheetName, 'A4', 42736);
          assertCell(sheetName, 'B4', undefined);
        }
        if (sheetName === 'CaseEventToComplexTypes') {
          assertCell(sheetName, 'G3', 'DefaultValue');
          assertCell(sheetName, 'G4', 'DefaultValue value');
          assertCell(sheetName, 'M4', 'Y');
        }
        if (sheetName === 'ChallengeQuestion') {
          assertCell(sheetName, 'E3', 'DisplayOrder');
          assertCell(sheetName, 'E4', '1');
          assertCell(sheetName, 'F3', 'QuestionText');
          assertCell(sheetName, 'F4', 'The Question');
          assertCell(sheetName, 'I3', 'Answer');
          assertCell(sheetName, 'I4', 'My Answer');
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
