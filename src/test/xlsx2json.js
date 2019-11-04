const assert = require('assert');
const glob = require('glob');
const fs = require('fs');
const run = require('../main/xlsx2json');
const fileUtils = require('../main/lib/file-utils');

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
    beforeEach(() => {
      glob.sync('./temp/*.json').forEach(path => {
        fs.unlinkSync(path);
      });
    });

    it('should create empty JSON files from embedded template', async () => {
      await run({
        _: [],
        sourceXlsx: './data/ccd-template.xlsx',
        sheetsDir: './temp'
      });

      const files = glob.sync('./temp/*.json');
      assert(files.length > 0, 'No files have been created');

      for (const file of files) {
        assert.deepEqual(await fileUtils.readJson(file), [], `${file} is not empty`);
      }
    });

    it('should create JSON files with human readable date fields', async () => {
      await run({
        _: ['Jurisdiction'],
        sourceXlsx: './src/test/fixtures/sheet/definition.xlsx',
        sheetsDir: './temp'
      });

      const files = glob.sync('./temp/*.json');
      assert(files.length > 0, 'No files have been created');
      const exported = await fileUtils.readJson('./temp/Jurisdiction.json');
      const expected = [{ Description: 'description', 'ID': 1, 'LiveFrom': '20/06/2017', 'LiveTo': '20/07/2018', 'Name': 'name' }];
      assert.deepEqual(exported, expected, 'Jurisdiction.json does not contain correctly formatted dates');
    });

  });
});
