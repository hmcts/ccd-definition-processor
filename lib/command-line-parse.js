const argv = require('minimist')(process.argv.slice(2))

function ParsedCmdLine() {
    self = this
    self.sheets = argv._
    self.filename = argv.f
    self.sheetsDir = argv.D ? argv.D : ""
    self.all = argv.a
    const validate = () => {
        return self.filename
    }
    self.valid = validate()
}

module.exports = { ParsedCmdLine }
