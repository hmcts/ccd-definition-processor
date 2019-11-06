const assert = require('assert');
const fileUtils = require('../main/lib/file-utils');

describe('file-utils', () => {

  describe('getJsonFilePaths', () => {
    it('lists all files in the directory if no filters are provided', () => {
      const filesInDirectory = fileUtils.getJsonFilePaths('./src/test/fixtures/listFiles');

      assert.equal(filesInDirectory.length, 2);
      assert.equal(filesInDirectory[0], 'NotExcluded.json');
      assert.equal(filesInDirectory[1], 'UserProfile.json');
    });

    it('lists all files in the directory if filters are not matching any of the file', () => {
      const filesInDirectory = fileUtils.getJsonFilePaths('./src/test/fixtures/listFiles', ['UserProfile']);

      assert.equal(filesInDirectory.length, 2);
      assert.equal(filesInDirectory[0], 'NotExcluded.json');
      assert.equal(filesInDirectory[1], 'UserProfile.json');
    });

    it('excludes the directory which is on the dir list', () => {
      const filesInDirectory = fileUtils.getJsonFilePaths('./src/test/fixtures/listFilesDirectory', ['excluded']);

      assert.equal(filesInDirectory.length, 1);
      assert.equal(filesInDirectory[0], 'dir/readMe.json');
    });

    it('excludes the files from the exclude list', () => {
      const filesInDirectory = fileUtils.getJsonFilePaths('./src/test/fixtures/listFiles', ['UserProfile.json']);

      assert.equal(filesInDirectory.length, 1);
      assert.equal(filesInDirectory[0], 'NotExcluded.json');
    });

    it('excludes the files from the exclude list by wildcard', () => {
      const filesInDirectory = fileUtils.getJsonFilePaths('./src/test/fixtures/listFilesWildcard', ['*-nonprod.json']);

      assert.equal(filesInDirectory.length, 1);
      assert.equal(filesInDirectory[0], 'Authorisation.json');
    });

    it('lists all files in a deep directory', () => {
      const filesInDirectory = fileUtils.getJsonFilePaths('./src/test/fixtures/deepJsonDefinitions');

      assert.equal(filesInDirectory.length, 6);
      assert.equal(filesInDirectory[0], 'CaseEvent/allStates.json');
      assert.equal(filesInDirectory[1], 'CaseEvent/Application/excluded/excludeMe.json');
      assert.equal(filesInDirectory[2], 'CaseEvent/Application/initiateCase.json');
      assert.equal(filesInDirectory[3], 'CaseEvent/Application/submitCase.json');
      assert.equal(filesInDirectory[4], 'CaseEvent/Case/revertCase.json');
      assert.equal(filesInDirectory[5], 'UserProfile.json');
    });

    it('lists all files in a deep directory with exclusions', () => {
      const filesInDirectory = fileUtils.getJsonFilePaths('./src/test/fixtures/deepJsonDefinitions', ['excluded']);

      assert.equal(filesInDirectory.length, 5);
      assert.equal(filesInDirectory[0], 'CaseEvent/allStates.json');
      assert.equal(filesInDirectory[1], 'CaseEvent/Application/initiateCase.json');
      assert.equal(filesInDirectory[2], 'CaseEvent/Application/submitCase.json');
      assert.equal(filesInDirectory[3], 'CaseEvent/Case/revertCase.json');
      assert.equal(filesInDirectory[4], 'UserProfile.json');
    });

  });
});
