# ccd-definition-processor

## Overview

Tooling to support collaborative development of CCD configuration thought the use of text based representation of CCD definitions, supporting textual comparison, change control and the treatment of configuration as source code during development.

## Features

### Variable substitution

A `json2xlsx` processor is able to replace variable placeholders defined in JSON definition files with values read from environment variables as long as variable name starts with `CCD_DEF` prefix. 
 
For example `CCD_DEF_BASE_URL=http://localhost` environment variable gets injected into fragment of following CCD definition:

```json
[
  {
    "LiveFrom": "2017-01-01",
    "CaseTypeID": "DRAFT",
    "ID": "initiateCase",
    "CallBackURLSubmittedEvent": "${CCD_DEF_BASE_URL}/callback"
  }
]
```

to become:

```json
[
  {
    "LiveFrom": "2017-01-01",
    "CaseTypeID": "DRAFT",
    "ID": "initiateCase",
    "CallBackURLSubmittedEvent": "http://localhost/callback"
  }
]
```

### JSON fragments

A `json2xlsx` processor is able to read smaller JSON fragments with CCD definitions that helps splitting large definition files into smaller chunks.

For example large `AuthorisationCaseField.json` file presented below: 

```json
[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "caseworker",
    "CRUD": "CRU"
  },
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "solicitor",
    "CRUD": "CRU"
  }
]
```

can be split into `caseworker.json` file presented below:

```json
[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "caseworker",
    "CRUD": "CRU"
  }
]
```

and `solicitor.json` file presented below:

```json
[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "solicitor",
    "CRUD": "CRU"
  }
]
```

located in `AuthorisationCaseField` directory that corresponds the XLS tab name.

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
* -i    file path to the XLSX for use with xlsx2json
* -D    (optional) path to the sheets folder; if no folder is specified the the current working directory is used

_[\<sheet name\> ...]:_

A list of sheet names in the XLSX for processing. Data will be imported from/to a file named \<sheet name\>.json. If no \<sheet name\>'s are specified then all JSON files will be processed that are found in the sheet folder path.

### Examples

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
$ docker build --tag hmcts/ccd-definition-processor:latest .
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
