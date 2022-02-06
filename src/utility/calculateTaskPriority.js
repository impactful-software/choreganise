import { add, differenceInDays } from "date-fns"

export default function calculateTaskPriority(task) {
  const dateCompleted = new Date(task.dateCompleted)
  const dateDue = add(dateCompleted, { [task.frequencyUnit]: task.frequency })
  const daysBetweenDueDates = differenceInDays(dateDue, dateCompleted)
  const daysPastDue = differenceInDays(new Date(), dateDue)

  return daysPastDue / daysBetweenDueDates
}
