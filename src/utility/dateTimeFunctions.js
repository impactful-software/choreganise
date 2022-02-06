import { add, getUnixTime } from "date-fns"

export function getTaskDueDate(task) {
  return add(new Date(task.dateCompleted), { [task.frequencyUnit]: task.frequency })
}

export function getWholeHours (seconds) {
  return Math.floor(seconds / 3600) || 0
}

export function getWholeMinutes (seconds) {
  return Math.floor(seconds / 60) % 60 || 0
}

export function getResidualSeconds (totalSeconds) {
  return totalSeconds % 60 || 0
}

export default function getTimeRemaining ({ duration, paused = false, startTime }) {
  if (paused) {
    return duration || 0
  } else {
    return Math.max(0, startTime + duration - getUnixTime(new Date())) || 0
  }
}

export function sumTimeComponents({ hours, minutes, seconds }) {
  return seconds + 60 * minutes + 3600 * hours || 0
}
