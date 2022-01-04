import { find, remove } from 'lodash'

class TaskList {
  constructor (tasks) {
    this.tasks = tasks.map((task, index) => ({
      id: ''.concat(index),
      ...task
    }))
  }

  create (props) {
    this.tasks.push(props)
  }

  delete (taskId) {
    remove(this.tasks, {id: taskId})
  }

  findAll () {
    return this.tasks.sort((a, b) => {
      if (a.dateCompleted < b.dateCompleted) {
        return -1
      } else if (a.dateCompleted === b.dateCompleted) {
        return 0
      } else {
        return 1
      }
    })
  }

  findById(taskId) {
    return find(this.tasks, {id: taskId})
  }

  update (props) {
    const task = this.findById(props.id)
    Object.assign(task, props)
  }
}

export default TaskList
