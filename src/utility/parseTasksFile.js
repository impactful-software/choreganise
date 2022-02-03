import fs from 'fs'

export default function parseTasksFile (path) {
  try {
    return JSON.parse(fs.readFileSync(path))
  } catch (error) {
    console.error(`Failed to read tasks from ${path}.`, error)
    throw Error(`Failed to read tasks from ${path}.`)
  }
}
