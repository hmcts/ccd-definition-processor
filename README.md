# ccd-definition-processor

## Overview

Tooling to support collaborative development of CCD configuration thought the use of text based representation of CCD definitions, supporting textual comparison, change control and the treatment of configuration as source code during development.

## Dependencies

Dependencies have to be installed prior first use by running:

```sh
$ yarn install
```

## Usage

The following commands are available:

```sh
$ yarn json2xlsx options [<sheet name> ...]
$ yarn xlsx2json options [<sheet name> ...]
```

Both commands take the following arguments:

_options:_

* -o    file path of the XLSX file to write
* -i    (optional) file path to the template XLSX file; if this is not specified then the embedded template file is used instead
* -D    (optional) path to the sheets folder; if no folder is specified the the current working directory is used

_[\<sheet name\> ...]:_

A list of sheet names in the XLSX for processing. Data will be imported from/to a file named \<sheet name\>.json. If no \<sheet name\>'s are specified then all JSON files will be processed that are found in the sheet folder path.

### Examples

To import data into the CaseTypes sheet of the CCD-Definition.xlsx spreadsheet from a file named CaseTypes.json in the folder ./sheets, you would use:

```sh
$ yarn json2xlsx -D ./sheets -i CCD-Definition.xlsx -o CCD-Definition.xlsx CaseTypes
```

To import all JSON files found in the ./sheets folder into a XLSX named CCD-Definition.xlsx which was created based on the embedded template CCD definition XLSX file, you would use:

```sh
$ yarn json2xlsx -D ./sheets -o CCD-Definition.xlsx
```

To export all of the sheets in a CCD definition XLSX file you would use:

```sh
$ yarn xlsx2json -D ./sheets -i CCD-Definition.xlsx
```

To export just CaseType and CaseEvent sheets from a CCD definition XLSX file you would use:

```sh
$ yarn xlsx2json -D ./sheets -i CCD-Definition.xlsx CaseType CaseEvent
```

## Docker image

To build Docker image please run:

```bash
$ docker build --tag docker.artifactory.reform.hmcts.net/ccd/ccd-definition-processor:latest .
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
