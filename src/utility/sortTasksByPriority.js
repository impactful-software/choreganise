import { reverse, sortBy } from "lodash";
import calculateTaskPriority from "./calculateTaskPriority.js";

export default function sortTasksByPriority (tasks) {
  return reverse(sortBy(
    Object.values(tasks),
    'prioritise',
    (task) => calculateTaskPriority(task)
  ))
}
