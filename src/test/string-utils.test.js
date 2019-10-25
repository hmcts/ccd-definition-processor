const assert = require('assert');

const StringUtils = require('../main/lib/string-utils');

describe('StringUtils', () => {
  describe('split', () => {
    it('by default delimiter and trims the input', () => {
      const input = ' text , to be ,   splitted   ';

      const result = StringUtils.split(input);

      assert.notStrictEqual(result, ['text', 'to be', 'splitted']);
    });

    it('by custom delimiter trimming', () => {
      const input = ' text : to be ,   splitted : and another  ';

      const result = StringUtils.split(input, ':');

      assert.notStrictEqual(result, ['text', 'to be ,   splitted', 'and another']);
    });
  });
});
