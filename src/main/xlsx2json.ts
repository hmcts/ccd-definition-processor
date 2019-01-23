import { ParsedArgs } from 'minimist'

import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'

import * as fileUtils from 'lib/file-utils'
import * as asyncUtils from 'lib/async-utils'
import { SpreadsheetReader } from 'lib/ccd-spreadsheet-reader'
import { Json } from 'types/json'
import { JsonHelper } from 'lib/json-helper'
import { JsonFormatter } from 'lib/json-formatter'

const validateArgs = (args: ParsedArgs): void => {
  assert(!!args.sourceXlsx, 'spreadsheet file argument (-i) is required')
  assert(!!args.sheetsDir, 'sheets directory argument (-D) is required')

  assert(fs.existsSync(args.sourceXlsx), `spreadsheet file ${args.sourceXlsx} not found`)
  assert(fs.existsSync(args.sheetsDir), `sheets directory ${args.sheetsDir} not found`)
}

export const run = async (args: ParsedArgs): Promise<void> => {
  validateArgs(args)

  console.log(`Export...\n loading workbook: ${args.sourceXlsx}`)
  const reader = new SpreadsheetReader(args.sourceXlsx)
  const sheets = args._.length > 0 ? args._ : reader.getSheetNames()

  await asyncUtils.forEach(sheets, async (sheet: string) => {
    const jsonFilePath = path.join(args.sheetsDir, `${sheet}.json`)
    console.log(` converting sheet to JSON: ${sheet} => ${jsonFilePath}`)
    const json: Json[] = reader.readSheetAsJson(sheet)
    JsonHelper.convertPropertyValueDateToString('LiveFrom', json)
    JsonHelper.convertPropertyValueDateToString('LiveTo', json)
    await fileUtils.writeJson(jsonFilePath, JsonFormatter.stringify(json))
  })

  console.log('done.')
}
