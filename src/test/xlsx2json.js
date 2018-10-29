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
    });

    it('should create JSON files with human readable date fields', async () => {
      await run({
        _: ['Jurisdiction'],
        sourceXlsx: './src/test/fixtures/sheet/definition.xlsx',
        sheetsDir: './temp'
      });

      const files = fileUtils.listJsonFilesInFolder('./temp');
      assert(files.length > 0, 'No files have been created');
      const exported = await fileUtils.readJson('./temp/Jurisdiction.json');
      const expected = [{ Description: 'description', 'ID': 1, 'LiveFrom': '2017-6-20', 'LiveTo': '2018-7-20', 'Name': 'name' }];
      assert.deepEqual(exported, expected, 'Jurisdiction.json does not contain correctly formatted dates');
    });

  });
});
