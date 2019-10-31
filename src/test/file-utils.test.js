const assert = require('assert');
const fileUtils = require('../main/lib/file-utils');

describe('file-utils', () => {

  describe('listFilesInDirectory', () => {
    it('lists all files in the directory if no filters are provided', () => {
      const filesInDirectory = fileUtils.listFilesInDirectory(
        './src/test/fixtures/listFiles'
      );

      assert.equal(filesInDirectory.length, 2);
      assert.equal(filesInDirectory[0].name, 'NotExcluded.json');
      assert.equal(filesInDirectory[1].name, 'UserProfile.json');
    });

    it('lists all files in the directory if filters are not matching any of the file', () => {
      const filesInDirectory = fileUtils.listFilesInDirectory(
        './src/test/fixtures/listFiles', ['UserProfile']
      );

      assert.equal(filesInDirectory.length, 2);
      assert.equal(filesInDirectory[0].name, 'NotExcluded.json');
      assert.equal(filesInDirectory[1].name, 'UserProfile.json');
    });

    it('excludes the directory which is on the dir list', () => {
      const filesInDirectory = fileUtils.listFilesInDirectory(
        './src/test/fixtures/listFilesDirectory', ['excluded']
      );

      assert.equal(filesInDirectory.length, 1);
      assert.equal(filesInDirectory[0].name, 'dir');
    });

    it('excludes the files from the exclude list', () => {
      const filesInDirectory = fileUtils.listFilesInDirectory(
        './src/test/fixtures/listFiles', ['UserProfile.json']
      );

      assert.equal(filesInDirectory.length, 1);
      assert.equal(filesInDirectory[0].name, 'NotExcluded.json');
    });

    it('excludes the files from the exclude list by wildcard', () => {
      const filesInDirectory = fileUtils.listFilesInDirectory(
        './src/test/fixtures/listFilesWildcard', ['*-nonprod.json']
      );

      assert.equal(filesInDirectory.length, 1);
      assert.equal(filesInDirectory[0].name, ['Authorisation.json']);
    });
  });

  describe('listFilesInDirectoryRec', () => {
    const directory = './src/test/fixtures/deepJsonDefinitions';

    it('lists all files in the directory', () => {
      const filesInDirectory = fileUtils.listFilesInDirectoryRec(directory, directory);

      assert.equal(filesInDirectory.length, 5);
      assert.equal(filesInDirectory[0], 'CaseEvent/Application/excluded/excludeMe.json');
    });

    it('lists all files in the directory with exclusions', () => {
      const filesInDirectory = fileUtils.listFilesInDirectoryRec(directory, directory, ['excluded']);

      assert.equal(filesInDirectory.length, 4);
      assert.ok(!filesInDirectory.includes('CaseEvent/Initiation/excluded/excludeMe.json'));
    });
  });
});
