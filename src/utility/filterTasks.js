import { filter as filterArray } from "lodash"

export default function filterTasks (tasks, filter = {}) {
  const filterProvided = Object.values(filter).join('').length > 0
  return filterProvided ? filterArray(tasks, filter) : tasks
}
