const assert = require('assert');

const run = require('../main/json2xlsx');

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
});
