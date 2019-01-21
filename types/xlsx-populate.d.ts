declare module 'xlsx-populate' {
  export function fromFileAsync (filename: string): any

  export function numberToDate (value: number): Date

  export function dateToNumber (value: Date): number
}
