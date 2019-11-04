const assert = require('assert');
const fileUtils = require('../main/lib/file-utils');
const sheetUtils = require('../main/lib/sheet-utils');

describe('file-utils', () => {

  describe('getJsonFiles', () => {
    it('lists all files in the directory if no filters are provided', () => {
      const filesInDirectory = getMapping('./src/test/fixtures/listFiles');

      assert.equal(Object.keys(filesInDirectory).length, 2);
      assert.ok(hasProperty(filesInDirectory, 'NotExcluded.json'));
      assert.ok(hasProperty(filesInDirectory, 'UserProfile.json'));
    });

    it(
      'lists all files in the directory if filters are not matching any of the file', () => {
        const filesInDirectory = getMapping('./src/test/fixtures/listFiles', ['UserProfile']);

        assert.equal(Object.keys(filesInDirectory).length, 2);
        assert.ok(hasProperty(filesInDirectory, 'NotExcluded.json'));
        assert.ok(hasProperty(filesInDirectory, 'UserProfile.json'));
      });

    it('excludes the directory which is on the dir list', () => {
      const filesInDirectory = getMapping('./src/test/fixtures/listFilesDirectory', ['excluded']);

      assert.equal(Object.keys(filesInDirectory).length, 1);
      assert.ok(hasProperty(filesInDirectory, 'dir'));
    });

    it('excludes the files from the exclude list', () => {
      const filesInDirectory = getMapping('./src/test/fixtures/listFiles', ['UserProfile.json']);

      assert.equal(Object.keys(filesInDirectory).length, 1);
      assert.ok(hasProperty(filesInDirectory, 'NotExcluded.json'));
    });

    it('excludes the files from the exclude list by wildcard', () => {
      const filesInDirectory = getMapping('./src/test/fixtures/listFilesWildcard', ['*-nonprod.json']);

      assert.equal(Object.keys(filesInDirectory).length, 1);
      assert.ok(hasProperty(filesInDirectory, 'Authorisation.json'));
    });

    it('lists all files in a deep directory', () => {
      const filesInDirectory = getMapping('./src/test/fixtures/deepJsonDefinitions');

      assert.equal(Object.keys(filesInDirectory).length, 2);
      assert.ok(hasProperty(filesInDirectory, 'CaseEvent'));
      assert.equal(filesInDirectory['CaseEvent'].length, 5);
      assert.ok(hasProperty(filesInDirectory, 'UserProfile.json'));
      assert.equal(filesInDirectory['UserProfile.json'].length, 0);
    });

    it('lists all files in a deep directory with exclusions', () => {
      const filesInDirectory = getMapping('./src/test/fixtures/deepJsonDefinitions', ['excluded']);

      assert.equal(Object.keys(filesInDirectory).length, 2);
      assert.ok(hasProperty(filesInDirectory, 'CaseEvent'));
      assert.equal(filesInDirectory['CaseEvent'].length, 4);
      assert.ok(hasProperty(filesInDirectory, 'UserProfile.json'));
      assert.equal(filesInDirectory['UserProfile.json'].length, 0);
    });

  });
});

const getMapping = (directory, exclusions = []) => sheetUtils.groupToSheets(
  fileUtils.getJsonFilePaths(directory, exclusions));

const hasProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
