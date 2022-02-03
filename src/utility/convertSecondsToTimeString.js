export default function convertSecondsToTimeString(seconds) {
  const hours = Math.floor(seconds / 3600)
  const redsidualMinutes = Math.floor(seconds / 60) % 60 // Modulo 60 removes whole hours
  const residualSeconds = seconds % 60 // Modulo 60 removes whole minutes

  return [hours, redsidualMinutes, residualSeconds]
    .map(part => part.toString().padStart(2, '0'))
    .join(':')
}
