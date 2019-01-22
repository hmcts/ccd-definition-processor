import * as moment from 'moment'
import * as XlsxPopulate from 'xlsx-populate'

import { Json } from 'types/json'

const dateFormat = 'DD/MM/YYYY'

export class JsonHelper {

  static convertPropertyValueDateToString (propertyName: string, json: Json[]) {
    json.forEach((obj: Json) => {
      if (obj[propertyName]) {
        const date = moment(XlsxPopulate.numberToDate(obj[propertyName] as number))
        obj[propertyName] = date.format(dateFormat)
      }
    })
  }

  static convertPropertyValueStringToDate (propertyName: string, json: Json[]) {
    json.forEach((obj: Json) => {
      if (obj[propertyName]) {
        const dateString: string = obj[propertyName] as string
        const date = moment(dateString, dateFormat).toDate()
        obj[propertyName] = XlsxPopulate.dateToNumber(date)
      }
    })
  }

}
