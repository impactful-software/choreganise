import { differenceInDays } from "date-fns"
import { getDateLastCompleted, getDateNextDue } from "./dateTimeFunctions.js"

export default function calculateTaskPriority(task) {
  const dateLastCompleted = getDateLastCompleted(task)
  const dateDue = getDateNextDue(task)
  const daysBetweenDueDates = differenceInDays(dateDue, dateLastCompleted)
  const daysPastDue = differenceInDays(new Date(), dateDue)

  return daysPastDue / daysBetweenDueDates
}
