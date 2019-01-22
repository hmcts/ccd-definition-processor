import * as fs from 'fs'
import * as path from 'path'

import { Json } from 'types/json'

export const readJson = (filename: string, processFn?: (data: string) => string): Promise<Json | Json[]> => {
  return new Promise((resolveFn: (value?: Json | Json[]) => void) => {
    fs.readFile(filename, 'utf8', (err: Error, data: string): void => {
      if (err) throw err
      if (processFn) {
        data = processFn(data)
      }
      resolveFn(JSON.parse(data))
    })
  })
}

export const writeJson = (filename: string, json: Json | Json[] | string): Promise<void> => {
  return new Promise((resolveFn: () => void) => {
    fs.writeFile(filename, json, (err) => {
      if (err) throw err
      resolveFn()
    })
  })
}

export const listJsonFilesInFolder = (dir: string): string[] => {
  const files: string[] = fs.readdirSync(dir)
  return files.filter((file: string): boolean => {
    return path.extname(file) === '.json'
  })
}
