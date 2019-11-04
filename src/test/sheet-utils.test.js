const assert = require('assert');
const sheetUtils = require('../main/lib/sheet-utils');

describe('sheet-utils', () => {
  describe('groupToSheets', () => {
    it('should group the paths by top level directory', function () {
      const paths = [
        'first/file.json',
        'first/another.json',
        'second/file.json'
      ];

      const grouped = sheetUtils.groupToSheets(paths);
      assert.equal(Object.keys(grouped).length, 2);
      assert.ok(hasProperty(grouped, 'first'));
      assert.equal(grouped['first'].length, 2);
      assert.equal(grouped['first'][0], 'file.json');
    });

    it('should have top level files as there own elements', function () {
      const paths = [
        'top/file.json',
        'another.json',
      ];

      const grouped = sheetUtils.groupToSheets(paths);
      assert.equal(Object.keys(grouped).length, 2);
      assert.ok(hasProperty(grouped, 'another.json'));
    });
  });
});

const hasProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
