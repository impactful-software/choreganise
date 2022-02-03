export default function normalizeTask (task) {
  task.name = task.name.toLowerCase()
  task.frequencyUnit = task.frequencyUnit.toLowerCase()
  task.location = task.location.toLowerCase()
  return task
}
