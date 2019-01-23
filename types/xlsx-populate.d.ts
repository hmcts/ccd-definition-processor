declare module 'xlsx-populate' {
  export function numberToDate (value: number): Date

  export function dateToNumber (value: Date): number

  export function fromFileAsync (path: string): Promise<Workbook>

  export interface Workbook {
    sheet (sheetNameOrIndex: string): Sheet | undefined

    toFileAsync (path: string): Promise<void>
  }

  export interface Sheet {
    cell (address: string): Cell

    range (address: string): Range
  }

  export interface Cell {
    value (value: any): Cell
  }

  export interface Range {
    value (): any[][]
  }
}
