const ENVIRONMENT_VARIABLE_PREFIX = 'CCD_DEF';

class Substitutor {
  static injectEnvironmentVariables (value) {
    Object.keys(process.env)
      .filter(environmentVariableName => environmentVariableName.startsWith(ENVIRONMENT_VARIABLE_PREFIX))
      .forEach(environmentVariableName => {
        const environmentVariableValue = process.env[environmentVariableName];
        value = value.replace(new RegExp('\\$\\{' + environmentVariableName + '\\}', 'g'), environmentVariableValue);
      });
    return value;
  }
}

module.exports = { Substitutor };
