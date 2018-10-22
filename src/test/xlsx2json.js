const assert = require('assert');

const run = require('../main/xlsx2json');

const fileUtils = require('../main/lib/file-utils');
const asyncUtils = require('../main/lib/async-utils');

describe('xlsx2json', () => {
  describe('validation', () => {
    it('should throw an error when spreadsheet file argument is not provided', async () => {
      try {
        await run({
          _: [],
          sourceXlsx: '',
          sheetsDir: './temp'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: spreadsheet file argument (-i) is required');
      }
    });

    it('should throw an error when sheets directory argument is not provided', async () => {
      try {
        await run({
          _: [],
          sourceXlsx: './data/ccd-template.xlsx',
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
        sheetsDir: './temp'
      });

      const files = fileUtils.listJsonFilesInFolder('./temp');
      assert(files.length > 0, 'No files have been created');

      asyncUtils.forEach(files, async file => {
        assert.deepEqual(await fileUtils.readJson(`./temp/${file}`), [], `File ${file} is not empty`);
      });
    }).timeout(5000);
  });
});
