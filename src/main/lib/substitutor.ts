const ENVIRONMENT_VARIABLE_PREFIX = 'CCD_DEF'

export class Substitutor {
  static injectEnvironmentVariables (value: string): string {
    Object.keys(process.env)
      .filter((environmentVariableName: string) => environmentVariableName.startsWith(ENVIRONMENT_VARIABLE_PREFIX))
      .forEach((environmentVariableName: string) => {
        const environmentVariableValue: string = process.env[environmentVariableName] as string
        value = value.replace(new RegExp('\\$\\{' + environmentVariableName + '\\}', 'g'), environmentVariableValue)
      })
    return value
  }
}
