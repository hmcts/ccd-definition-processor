import * as parseArgs from 'minimist'

import { run } from 'json2xlsx'

run(parseArgs(process.argv.slice(2), {
  string: [
    'D',
    'o'
  ],
  alias: {
    sheetsDir: 'D',
    destinationXlsx: 'o'
  }
})).catch((err: Error) => console.log(err.toString()))
