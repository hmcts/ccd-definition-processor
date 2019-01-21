import { WorkSheet } from 'xlsx'

declare module 'xlsx' {
  export interface WorkBook {
    sheet (name: string): WorkSheet

    toFileAsync (filename: string): Promise<any>
  }

  export interface WorkSheet {
    range (range: string): any
  }
}
