import { ParsedArgs } from 'minimist'

import * as path from 'path'
import * as assert from 'assert'

import * as fileUtils from './lib/file-utils'
import * as asyncUtils from './lib/async-utils'
import * as ccdUtils from './lib/ccd-spreadsheet-utils'
import { JSON } from '../../types/json'

const jsonUtil = ccdUtils.JsonHelper

const validateArgs = (args: ParsedArgs): void => {
  assert(!!args.sourceXlsx, 'spreadsheet file argument (-i) is required')
  assert(!!args.sheetsDir, 'sheets directory argument (-D) is required')

  assert(fileUtils.exists(args.sourceXlsx), `spreadsheet file ${args.sourceXlsx} not found`)
  assert(fileUtils.exists(args.sheetsDir), `sheets directory ${args.sheetsDir} not found`)
}

export const run = async (args: ParsedArgs): Promise<void> => {
  validateArgs(args)

  console.log(`Export...\n loading workbook: ${args.sourceXlsx}`)
  const converter = new ccdUtils.SpreadsheetConvert(args.sourceXlsx)
  const sheets = args._.length > 0 ? args._ : converter.allSheets()

  await asyncUtils.forEach(sheets, async (sheet: string) => {
    const jsonFilePath = path.join(args.sheetsDir, `${sheet}.json`)
    console.log(` converting sheet to JSON: ${sheet} => ${jsonFilePath}`)
    const json: JSON = await converter.sheet2Json(sheet)
    jsonUtil.convertPropertyValueDateToString('LiveFrom', json)
    jsonUtil.convertPropertyValueDateToString('LiveTo', json)
    await fileUtils.writeJson(jsonFilePath, jsonUtil.stringify(json))
  })

  console.log('done.')
}
