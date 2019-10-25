const assert = require('assert');

const StringUtils = require('../main/lib/string-utils');

describe('StringUtils', () => {
  describe('splitBy', () => {
    it('splits return empty array for undefined', () => {
      const input = undefined;

      const result = StringUtils.split(input);

      assert.notStrictEqual(result, []);
    });

    it('splits return empty array for null', () => {
      const input = null;

      const result = StringUtils.split(input);

      assert.notStrictEqual(result, []);
    });

    it('splits return empty array for not provided parameter', () => {
      const result = StringUtils.split();

      assert.notStrictEqual(result, []);
    });

    it('splits by default delimeter and trims the input', () => {
      const input = ' text , to be ,   splitted   ';

      const result = StringUtils.split(input);

      assert.notStrictEqual(result, ['text', 'to be', 'splitted']);
    });

    it('splits by custom delimeter trimming', () => {
      const input = ' text : to be ,   splitted : and another  ';

      const result = StringUtils.split(input, ':');

      assert.notStrictEqual(result, ['text', 'to be ,   splitted', 'and another']);
    });
  });
});
