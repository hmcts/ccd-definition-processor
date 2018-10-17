# ccd-definition-processor
## Overview
CI tooling to support collaborative development of CCD configuration thought the use of text based representation of the required definitions found in the CCD definition spreadsheet. Supporting textual comparison and change control and the treatment of configuration as source during development.

## Usage
```
xlsx2json options [< sheet name > ...]
json2xlsx options [< sheet name > ...]
```
To change cell values of a specified sheet or sheets in a CCD Definition excel spreadsheet use the **update** command

Which can be executed using yarn and npm: 
```
 - yarn xlsx2json ...
 - npm run xlsx2json ...
```

*[< sheet name > ...]:*
* a list of sheet names, each name is the name of a destination sheet in the xlsx
*data will be imported from a file named < sheet name >.json
* if no < sheet name >'s are specified then all json files will be loaded that are found in the sheet folder path

*_Options:_*
* -o    filepath of the xlsx file to write
* -i    filepath to the source xlsx file if this is not specified then the template file is used instead
* -D    (optional) path to the sheets folder - if no folder is specified the the current working directory is used

## Examples:

 To import data into the CaseTypes sheet of the CCD-Definition.xlsx spreadsheet from a file named CaseTypes.json in the folder ./sheetData/ , you would use:
```
    yarn json2xlsx -D ./sheetData/ -i CCD-Definition.xlsx -o CCD-Definition.xlsx CaseTypes
```

To import all json files found in the ./some/path/sheets/ folder into a xlsx named CCD-Definition.xlsx which was created based on the embedded template CCD definition xlsx file, you would use:

```
    yarn json2xlsx -D ./some/path/sheetData/ -o CCD-Definition.xlsx
```

To export all of the sheets in a CCD definition xlsx file you would use:
```
    yarn xlsx2json -D ./some/folder/ -i CCD-Definition.xlsx
```

To export just CaseType and CaseEvent sheets from a CCD definition xlsx file you would use:
```
    yarn xlsx2json -D ./some/folder/ -i CCD-Definition.xlsx CaseType CaseEvent
```