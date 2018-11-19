const assert = require('assert');

const { Substitutor } = require('../main/lib/substitutor');

describe('Substitutor', () => {
  describe('injecting environment variables', () => {
    context('when input does not contain variable placeholders', () => {
      it('should return unchanged input', () => {
        const template = 'Static text';

        const result = Substitutor.injectEnvironmentVariables(template);

        assert.equal(result, template);
      });
    });

    context('when input contains variable placeholders', () => {
      it('should return unchanged input when no value exists', () => {
        const template = 'Version: ${CCD_DEF_VERSION}';

        const result = Substitutor.injectEnvironmentVariables(template);

        assert.equal(result, template);
      });

      it('should return unchanged input when environment variable does not start with supported prefix', () => {
        const template = 'Version: ${VERSION}';

        process.env.VERSION = '1.0.0';
        const result = Substitutor.injectEnvironmentVariables(template);

        assert.equal(result, template);
      });

      it('should return string with value extracted from environment variable when one placeholder is used', () => {
        const template = 'Version: ${CCD_DEF_VERSION}';

        process.env.CCD_DEF_VERSION = '1.0.0';
        const result = Substitutor.injectEnvironmentVariables(template);

        assert.equal(result, 'Version: 1.0.0');
      });

      it('should return string with all values extracted from environment variables when placeholder is used many times', () => {
        const template = 'Name: ${CCD_DEF_NAME}; Raw name: ${CCD_DEF_NAME}';

        process.env.CCD_DEF_NAME = 'FPL';
        const result = Substitutor.injectEnvironmentVariables(template);

        assert.equal(result, 'Name: FPL; Raw name: FPL');
      });

      it('should return string with values extracted from environment variables when many placeholders are used', () => {
        const template = 'Name: ${CCD_DEF_NAME}; Version: ${CCD_DEF_VERSION}';

        process.env.CCD_DEF_NAME = 'FPL';
        process.env.CCD_DEF_VERSION = '1.0.0';
        const result = Substitutor.injectEnvironmentVariables(template);

        assert.equal(result, 'Name: FPL; Version: 1.0.0');
      });
    });
  });
});
