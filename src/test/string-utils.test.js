const assert = require('assert');

const StringUtils = require('../main/lib/string-utils');

describe('StringUtils', () => {
  describe('splitBy', () => {
    it('splits by default delimeter and trims the input', () => {
      const input = ' text , to be ,   splitted   ';

      const result = StringUtils.split(input);

      console.log(result);
      assert.notStrictEqual(result, ['text', 'to be', 'splitted']);
    });

    it('splits by custom delimeter trimming', () => {
      const input = ' text : to be ,   splitted : and another  ';

      const result = StringUtils.split(input, ':', false);

      console.log(result);
      assert.notStrictEqual(result,  ['text', 'to be ,   splitted', 'and another']);
    });
  });
});
