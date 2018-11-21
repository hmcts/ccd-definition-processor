import * as parseArgs from 'minimist'

import { run } from '../src/main/xlsx2json'

run(parseArgs(process.argv.slice(2), {
  string: [
    'i',
    'D'
  ],
  alias: {
    sourceXlsx: 'i',
    sheetsDir: 'D'
  }
})).catch((err: Error) => console.log(err.toString()))
