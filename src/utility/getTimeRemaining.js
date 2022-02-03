import getTimeInSeconds from "./getTimeInSeconds"

export function getWholeHours (seconds) {
  return Math.floor(seconds / 3600)
}

export function getWholeMinutes (seconds) {
  return Math.floor(seconds / 60) % 60
}

export function getResidualSeconds (totalSeconds) {
  return totalSeconds % 60
}

export default function getTimeRemaining ({ duration, paused = false, startTime }) {
  if (paused) {
    return duration
  } else {
    return Math.max(0, startTime + duration - getTimeInSeconds(new Date()))
  }
}
