import * as assert from 'assert'

import { run } from 'xlsx2json'

import * as fileUtils from 'lib/file-utils'
import * as asyncUtils from 'lib/async-utils'

import { Json } from '../../types/json'

describe('xlsx2json', () => {
  describe('validation', () => {
    it('should throw an error when spreadsheet file argument is not provided', async () => {
      try {
        await run({
          _: [],
          sourceXlsx: '',
          sheetsDir: './temp'
        })
        assert.fail('No error has been thrown')
      } catch (err) {
        assert.strictEqual(`${err.name}: ${err.message}`, 'AssertionError [ERR_ASSERTION]: spreadsheet file argument (-i) is required')
      }
    })

    it('should throw an error when sheets directory argument is not provided', async () => {
      try {
        await run({
          _: [],
          sourceXlsx: './data/ccd-template.xlsx',
          sheetsDir: ''
        })
        assert.fail('No error has been thrown')
      } catch (err) {
        assert.strictEqual(`${err.name}: ${err.message}`, 'AssertionError [ERR_ASSERTION]: sheets directory argument (-D) is required')
      }
    })
  })

  describe('outcome', () => {
    it('should create empty JSON files from embedded template', async () => {
      await run({
        _: [],
        sourceXlsx: './data/ccd-template.xlsx',
        sheetsDir: './temp'
      })

      const files = fileUtils.listJsonFilesInFolder('./temp')
      assert(files.length > 0, 'No files have been created')

      await asyncUtils.forEach(files, async file => {
        assert.deepStrictEqual(await fileUtils.readJson(`./temp/${file}`), [], `File ${file} is not empty`)
      })
    })

    it('should create JSON files with human readable date fields', async () => {
      await run({
        _: ['Jurisdiction'],
        sourceXlsx: './src/test/fixtures/sheet/definition.xlsx',
        sheetsDir: './temp'
      })

      const files: string[] = fileUtils.listJsonFilesInFolder('./temp')
      assert(files.length > 0, 'No files have been created')

      const exported: Json[] = await fileUtils.readJson('./temp/Jurisdiction.json') as Json[]
      const expected: Json[] = [{
        Description: 'description',
        'ID': 1,
        'LiveFrom': '20/06/2017',
        'LiveTo': '20/07/2018',
        'Name': 'name'
      }]
      assert.deepStrictEqual(exported, expected, 'Jurisdiction.json does not contain correctly formatted dates')
    })

  })
})
