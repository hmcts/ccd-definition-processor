const argv = require('minimist')(process.argv.slice(2))
const assert = require('assert');
const fs = require('fs')

// TODO: get file relative to this js?
const TEMPLATE_FILE = './data/ccd-template.xlsx'

class Options {

  constructor() {
    // spreadsheet sheet names
    this.sheets = argv._
    this.all = this.sheets.length === 0

    // source and dest xlsx files
    this.destXlsx = argv.o
    this.sourceXlsx = argv.i

    // template file
    this.useTemplate = !this.sourceXlsx
    this.templatePath = TEMPLATE_FILE

    // json data file directory
    this.sheetsDir = ''
    if (argv.D) {
      this.sheetsDir = argv.D
      assert(fs.existsSync(this.sheetsDir), 'sheets folder not found - ' + this.sheetsDir)
    }

    // clear sheet override
    this.clear = argv.Clear
  }
}

module.exports = { Options }
