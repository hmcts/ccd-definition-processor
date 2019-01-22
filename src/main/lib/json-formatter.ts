import * as stringify from 'json-stringify-pretty-compact'

import { Json } from 'types/json'

export class JsonFormatter {
  static stringify (json: Json | Json[]) {
    return stringify(json, { maxLength: 420, indent: 2 })
  }
}
