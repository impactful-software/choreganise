import { add, getUnixTime } from "date-fns"

export function convertSecondsToTimeString (seconds) {
  const hours = Math.floor(seconds / 3600)
  const redsidualMinutes = Math.floor(seconds / 60) % 60 // Modulo 60 removes whole hours
  const residualSeconds = seconds % 60 // Modulo 60 removes whole minutes

  return [hours, redsidualMinutes, residualSeconds]
    .map(part => part.toString().padStart(2, '0'))
    .join(':')
}

export function getDateNextDue (task) {
  const dateLastCompleted = getDateLastCompleted(task)
  return add(dateLastCompleted, { [task.frequencyUnit]: task.frequency })
}

export function getDateLastCompleted (task) {
  if (task.completions && task.completions.length > 0) {
    return new Date(task.completions[task.completions.length -1].time * 1000)
  } else {
    return new Date(0)
  }
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

export function parseTimeString (time) {
  const [hours, minutes, seconds] = time.split(':').map(part => +part)

  if (Number.isNaN(hours)) {
    throw Error(`Invalid hours value '${hours}' in time string '${time}'.`)
  }

  if (Number.isNaN(minutes)) {
    throw Error(`Invalid minutes value '${minutes}' in time string '${time}'.`)
  }

  if (typeof seconds !== 'undefined' && Number.isNaN(seconds)) {
    throw Error(`Invalid seconds value '${seconds}' in time string '${time}'.`)
  }

  return { hours, minutes, seconds: seconds || 0 }
}

export function sumTimeComponents ({ hours = 0, minutes = 0, seconds = 0 }) {
  if ([hours, minutes, seconds].filter(isNaN).length !== 0) {
    console.error('Cannot sum non-numeric time components.', { hours, minutes, seconds })
    throw Error('Cannot sum non-numeric time components.')
  }
  return +seconds + 60 * +minutes + 3600 * +hours || 0
}
