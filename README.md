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
These fragments can be read from any level of nested directory as long as the top level directory corresponds to a valid sheet name.

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

### Access control shortcuts

**UserRoles** and **AccessControl** tags has special meanings which reduces verbosity of access control related definitions

```json
[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRoles": ["caseworker1","caseworker2"],
    "CRUD": "CRU"
  }
]
```

is transformed to

```json
[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "caseworker1",
    "CRUD": "CRU"
  },
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "caseworker2",
    "CRUD": "CRU"
  }
]
```

And 

```json
[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "AccessControl": [
      {
        "UserRoles": ["caseworker1", "caseworker2"],
        "CRUD": "CR"
      },
      {
        "UserRoles": ["caseworker3"],
        "CRUD": "D"
      }
    ]
  }
]
```

is transformed to

```json
[
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "caseworker1",
    "CRUD": "CR"
  },
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "caseworker2",
    "CRUD": "CR"
  },
  {
    "LiveFrom": "01/01/2017",
    "CaseTypeID": "DRAFT",
    "CaseFieldID": "caseTitle",
    "UserRole": "caseworker3",
    "CRUD": "D"
  }
]
```

## Dependencies

Dependencies have to be installed prior first use by running:

```sh
$ yarn install
```

## Usage

The following commands are available:

```sh
$ yarn json2xlsx options
$ yarn xlsx2json options [<sheet name> ...]
```

Commands take the following arguments:

###  json2xlsx

_options:_

* -o    path to the output XLSX file
* -D    path to the input folder with JSON files
* -e    (optional) comma delimited list of wildcards patterns of the files which needs to be excluded from processing,
        i.e. -e 'UserProfile.json, *-nonprod.json' will exclude UserProfile.json and all -nonprod.json files from processing 

#### Warning: 

The previous support for includes parameters to select JSON files to process was removed (replaced with -e option).

###  xlsx2json

* -i    path to the input XLSX file
* -D    path to the output folder for JSON files

[\<sheet name\> ...]: A list of sheet names in the XLSX for processing. Data will be imported to a file named <sheet name>.json. If no <sheet name>'s are specified then all JSON files will be processed that are found in the sheet folder path.

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
$ docker build --tag hmctspublic.azurecr.io/ccd/definition-processor:latest .
```

## Building

Dockerhub (https://hub.docker.com/r/hmcts/ccd-definition-processor) is deprecated - please use ACR.

Any commit or merge into master will automatically trigger an Azure ACR task. This task has been manually
created using `./bin/deploy-acr-task.sh`. The task is defined in `acr-build-task.yaml`. 

Note: you will need a GitHub personal token defined in `GITHUB_TOKEN` environment variable to run deploy script (https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line). The token is for setting up a webhook so Azure will be notified when a merge or commit happens. Make sure you are a repo admin and select token scope of: `admin:repo_hook  Full control of repository hooks`

More info on ACR tasks can be read here: https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tasks-overview

## License 

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
