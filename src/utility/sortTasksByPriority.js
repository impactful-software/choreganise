import { sortBy } from "lodash";
import calculateTaskPriority from "./calculateTaskPriority";

export default function sortTasksByPriority (tasks) {
  return sortBy(
    Object.values(tasks),
    (task) => -1 * calculateTaskPriority(task)
  )
}
