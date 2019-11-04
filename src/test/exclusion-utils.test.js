const assert = require('assert');
const exclusionUtils = require('../main/lib/exclusion-utils');

describe('exclusion-utils', () => {
  describe('prepareExclusion', () => {
    it('should format a file exclusion', () => {
      const exclusion = ['someFile.json', '*all-these.json'];
      const results = exclusion.map(exclusion => exclusionUtils.prepareExclusion(exclusion));

      assert.equal(results.length, 2);
      assert.equal(results[0], '*someFile.json');
      assert.equal(results[1], '*all-these.json');
    });

    it('should format a directory exclusion', () => {
      const exclusion = ['someDirectory', '*all-these-directories'];
      const results = exclusion.map(exclusion => exclusionUtils.prepareExclusion(exclusion));

      assert.equal(results.length, 2);
      assert.equal(results[0], '*someDirectory/*');
      assert.equal(results[1], '*all-these-directories/*');
    });

  });
});
