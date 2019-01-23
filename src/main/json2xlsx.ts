import { ParsedArgs } from 'minimist'

import * as fs from 'fs'
import * as path from 'path'
import * as assert from 'assert'

import * as fileUtils from 'lib/file-utils'
import * as asyncUtils from 'lib/async-utils'
import { SpreadsheetBuilder } from 'lib/ccd-spreadsheet-utils'
import { Substitutor } from 'lib/substitutor'
import { Json } from 'types/json'
import { JsonHelper } from 'lib/json-helper'

const validateArgs = (args: ParsedArgs): void => {
  assert(!!args.sheetsDir, 'sheets directory argument (-D) is required')
  assert(!!args.destinationXlsx, 'spreadsheet file argument (-o) is required')

  assert(fs.existsSync(args.sheetsDir), `sheets directory ${args.sheetsDir} not found`)
}

export const run = async (args: ParsedArgs): Promise<void> => {
  validateArgs(args)

  console.log(`Import...\n loading template workbook`)
  const builder = new SpreadsheetBuilder()
  await builder.loadAsync()

  const sheets = args._.length > 0 ? args._ : fileUtils
    .listJsonFilesInFolder(args.sheetsDir)
    .map((filename) => filename.slice(0, -5))

  await asyncUtils.forEach(sheets, async (sheet) => {
    const jsonPath = path.join(args.sheetsDir, `${sheet}.json`)
    console.log(`  importing sheet data: ${jsonPath}`)
    const json: Json[] = await fileUtils.readJson(jsonPath, Substitutor.injectEnvironmentVariables) as Json[]
    JsonHelper.convertPropertyValueStringToDate('LiveFrom', json)
    JsonHelper.convertPropertyValueStringToDate('LiveTo', json)
    builder.updateSheetDataJson(sheet, json)
  })

  console.log(` saving workbook: ${args.destinationXlsx}`)
  await builder.saveAsAsync(args.destinationXlsx)

  console.log('done.')
}
