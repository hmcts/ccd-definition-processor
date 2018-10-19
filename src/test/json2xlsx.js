const assert = require('assert');
const XLSX = require('xlsx');

const run = require('../main/json2xlsx');

const fileUtils = require('../main/lib/file-utils');
const asyncUtils = require('../main/lib/async-utils');

describe('json2xlsx', () => {
  describe('validation', () => {
    it('should throw an error when source spreadsheet file argument is not provided', async () => {
      try {
        await run({
          _: [],
          sourceXlsx: '',
          destinationXlsx: './temp/ccd-definitions.xlsx',
          sheetsDir: './temp'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: source spreadsheet file argument (-i) is required');
      }
    });

    it('should throw an error when destination spreadsheet file argument is not provided', async () => {
      try {
        await run({
          _: [],
          sourceXlsx: './data/ccd-template.xlsx',
          destinationXlsx: '',
          sheetsDir: './temp'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: destination spreadsheet file argument (-o) is required');
      }
    });

    it('should throw an error when sheets directory argument is not provided', async () => {
      try {
        await run({
          _: [],
          sourceXlsx: './data/ccd-template.xlsx',
          destinationXlsx: './temp/ccd-definitions.xlsx',
          sheetsDir: ''
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: sheets directory argument (-D) is required');
      }
    });
  });

  describe('outcome', () => {
    it('should create empty JSON files from embedded template', async () => {
      await run({
        _: [],
        sourceXlsx: './data/ccd-template.xlsx',
        destinationXlsx: './temp/ccd-definitions.xlsx',
        sheetsDir: './temp'
      });

      const sheets = Object.keys(XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets)
      assert(sheets.length > 0, 'No sheets have been created');

      const files = fileUtils.listJsonFilesInFolder('./temp');
      asyncUtils.forEach(files, file => {
        assert(sheets.includes(file.slice(0, -5)), `Sheet corresponding to JSON file ${file} does not exist`);
      });
    }).timeout(15000);
  });
});
