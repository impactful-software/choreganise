export default function getTimeInSeconds (dateTime) {
  return Math.floor(dateTime.getTime() / 1000)
}
