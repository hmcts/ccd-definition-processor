# ccd-definition-processor
## Overview
CI tooling to support collaborative development of CCD UI thought the use of text based representation of definitions. Supporting textual comparison and change control.

## Update
```
update options <sheet name> ...

Execute using yarn, npm or node: 
 - yarn update ...
 - npm run update ...
 - node update ...

example:
    yarn update -a -D ./sheetData/ -f CCD-Definition.xlsx
```

*_Options:_*

* -f    path to xlsx file
* -D    path to the sheets folder
* -a    (optional) import all files in sheets folder, the list of sheet names is ignored
 