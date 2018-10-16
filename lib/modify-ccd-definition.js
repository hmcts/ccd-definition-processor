const XlsxPopulate = require('xlsx-populate')

function DefinitionFile(filename) {
    var self = this;
    self.updateSheetDataJson = (sheetname, json) => {
        var sheet = self.workbook.sheet(sheetname)
        sheet.range("A4:Z1000").clear();
        var headers = sheet.range("A3:AZ3").value()[0].filter(el => !!el);
        var table = json.map(record => {
            return headers.map(key => {
                var data = record[key];
                return data ? data : null;
            });
        });
        sheet.cell("A4").value(table);
    }
    self.loadAsync = async () => self.workbook = await XlsxPopulate.fromFileAsync(self.filename)
    self.saveAsAsync = (newfilename) => self.workbook.toFileAsync(newfilename)
    self.saveAsync = () => self.workbook.toFileAsync(self.filename)
    self.filename = filename
}

module.exports = { DefinitionFile }
