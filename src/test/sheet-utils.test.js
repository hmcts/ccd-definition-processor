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
      assertGroupExists(grouped, 'first', ['file.json', 'another.json']);
      assertGroupExists(grouped, 'second', ['file.json']);
    });

    it('should have top level files as there own elements', function () {
      const paths = [
        'top/file.json',
        'another.json',
      ];

      const grouped = sheetUtils.groupToSheets(paths);
      assert.equal(Object.keys(grouped).length, 2);
      assertGroupExists(grouped, 'top', ['file.json']);
      assertGroupExists(grouped, 'another.json', []);
    });
  });
});

function assertGroupExists (groups, groupName, elements) {
  assert.ok(Object.prototype.hasOwnProperty.call(groups, groupName));
  assert.equal(groups[groupName].length, elements.length);
  for (let i = 0; i < elements.length; i++) {
    assert.equal(groups[groupName][i], elements[i]);
  }
}
