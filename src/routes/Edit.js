import './Edit.css'
import { BSON } from 'realm-web'
import { Component } from 'react'
import toast from 'react-hot-toast'
import { RealmAppContext } from '../components/RealmApp'
import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED, ACTION_STATUS_SUCCEEDED } from '../utility/config'
import { useNavigate, useParams } from 'react-router-dom'
import { defaultTask } from '../store/taskListSlice'
import normalizeTask from '../utility/normalizeTask'

class Edit extends Component {
  static contextType = RealmAppContext

  constructor (props) {
    super(props)

    this.state = {
      deleted: false,
      fetchTaskStatus: ACTION_STATUS_IDLE,
      saveTaskStatus: ACTION_STATUS_IDLE,
      task: defaultTask
    }

    this.handleDeleteTaskClick = this.handleDeleteTaskClick.bind(this)
    this.handleFormFieldChange = this.handleFormFieldChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  async componentDidMount () {
    this.realm = this.context
    this.tasksCollection = this.realm.db.collection('tasks')
    this.fetchTask()
  }

  async componentWillUnmount () {
    if (this.watchStream) {
      const { taskId } = this.props.params
      console.debug(`Closing watch stream for task ${taskId}.`, this.watchStream)
      const result = await this.watchStream.return()
      console.debug(`CLOSED watch stream for task ${taskId}.`, result, this.watchStream)
    }
  }

  async componentDidUpdate (prevProps, prevState) {
    if (this.state.deleted && !prevState.deleted) {
      await this.watchStream.return()
    }

    if (this.props.params !== prevProps.params) {
      this.fetchTask()
    }
  }

  async fetchTask () {
    const { taskId } = this.props.params

    if (taskId) {
      this.setState({ fetchTaskStatus: ACTION_STATUS_LOADING })
      const task = await this.tasksCollection.findOne({_id: BSON.ObjectID(taskId)})

      if (task === null) {
        toast.error('Task not found. Submitting this form will create a new task.')
        this.setState({ fetchTaskStatus: ACTION_STATUS_REJECTED })
      } else {
        console.debug('Task found, creating a watch stream.', task)
        this.watchStream = this.tasksCollection.watch({}, [BSON.ObjectID(taskId)])

        this.setState({
          fetchTaskStatus: ACTION_STATUS_SUCCEEDED,
          task
        })

        this.monitorWatchStream()
      }
    } else {
      this.setState({
        fetchTaskStatus: ACTION_STATUS_SUCCEEDED,
        task: {...defaultTask}
      })
    }
  }

  async monitorWatchStream () {
    for await (const event of this.watchStream) {
      const { fetchTaskStatus } = this.state

      if (fetchTaskStatus === ACTION_STATUS_REJECTED) {
        // Stop watching for events if the task failed to load.
        break
      } else if (fetchTaskStatus !== ACTION_STATUS_SUCCEEDED) {
        // Ignore events detected before the task has loaded.
        continue
      }

      switch (event.operationType) {
        case 'update':
        case 'replace': {
          console.debug('Task updated.', event, this.watchStream)
          this.setState({ task: event.fullDocument })
          break
        }

        case 'delete': {
          console.debug('Task deleted.', event, this.watchStream)
          toast.error('This task has been deleted. Saving this form will create a new task.')
          this.setState({ deleted: true })
          break
        }

        default: {
          console.debug('Unexpected task operation received.', event, this.watchStream)
        }
      }
    }
  }

  async handleDeleteTaskClick (event) {
    event.preventDefault()

    const { taskId } = this.props.params

    if (taskId) {
      try {
        await this.tasksCollection.deleteOne({ _id: BSON.ObjectID(taskId) })
        toast.success('Task deleted.')
      } catch (error) {
        toast.error('Failed to delete task.')
        console.error('Failed to delete task.', error)
      }
    } else {
      console.error('Cannot delete a task before it is created.')
    }
  }

  async handleFormFieldChange (event) {
    this.setState({
      saveTaskStatus: ACTION_STATUS_IDLE,
      task: {
        ...this.state.task,
        [event.target.name]: event.target.value
      }
    })
  }

  async handleFormSubmit (event) {
    event.preventDefault()

    const { deleted, task } = this.state
    const { navigate, params } = this.props
    const { taskId } = params

    const formData = new FormData(event.target)
    const data = normalizeTask({
      "name": formData.get('name'),
      "icon": formData.get('icon'),
      "prioritise": formData.has('prioritise'),
      "duration": formData.get('duration'),
      "frequency": formData.get('frequency'),
      "frequencyUnit": formData.get('frequencyUnit'),
      "location": formData.get('location'),
      "dateCompleted": formData.get('dateCompleted')
    })

    if (taskId && !deleted) {
      this.setState({ saveTaskStatus: ACTION_STATUS_LOADING })

      Object.assign(task, data)
      await this.tasksCollection.updateOne({ _id: BSON.ObjectID(taskId) }, task)

      this.setState({ saveTaskStatus: ACTION_STATUS_SUCCEEDED })
      toast.success('Task updated.')
    } else {
      this.setState({ saveTaskStatus: ACTION_STATUS_LOADING })

      const { insertedId } = await this.tasksCollection.insertOne(data)

      this.setState({
        deleted: false,
        saveTaskStatus: ACTION_STATUS_SUCCEEDED
      })
      toast.success('Task created.')

      navigate(`./${insertedId}`)
    }
  }

  render () {
    const { fetchTaskStatus, saveTaskStatus, task } = this.state
    const { taskId } = this.props.params

    return fetchTaskStatus === ACTION_STATUS_LOADING || (fetchTaskStatus === ACTION_STATUS_IDLE && taskId) ? (
      <p>Loading.</p>
    ) : fetchTaskStatus === ACTION_STATUS_REJECTED ? (
      <p>Error finding task details.</p>
    ) : (
      <form action="/view" className="editTaskForm" onSubmit={this.handleFormSubmit}>
        <div>
          <label>Task name</label>
          <input
            className="taskFormInput"
            name="name"
            onChange={this.handleFormFieldChange}
            placeholder="enter name of task"
            value={task.name}
            type="text"
          />
        </div>

        <div>
          <label>Icon</label>
          <input
            className="taskFormInput"
            name="icon"
            onChange={this.handleFormFieldChange}
            placeholder="enter name of icon from Font Awesome"
            value={task.icon}
            type="text"
          />
        </div>

        <div>
          <label>Prioritise</label>
          <input
            checked={task.prioritise}
            className="prioritise"
            name="prioritise"
            onChange={this.handleFormFieldChange}
            type="checkbox"
          />
        </div>

        <div>
          <label>Duration</label>
          <input
            className="taskFormInput"
            name="duration"
            onChange={this.handleFormFieldChange}
            placeholder="hh:mm:ss"
            type="time"
            value={task.duration}
          />
        </div>

        <div>
          <label>Frequency</label>
          <input
            className="taskFormInput"
            name="frequency"
            onChange={this.handleFormFieldChange}
            placeholder="number"
            value={task.frequency}
            type="number"
          />
          <select
            className="taskFormInput"
            onChange={this.handleFormFieldChange}
            name="frequencyUnit"
            type="text"
            value={task.frequencyUnit}
          >
            <option value="days">Day(s)</option>
            <option value="weeks">Week(s)</option>
            <option value="months">Month(s)</option>
            <option value="years">Year(s)</option>
          </select>
        </div>

        <div>
          <label>Location/Category</label>
          <select
            className="taskFormInput"
            name="location"
            onChange={this.handleFormFieldChange}
            value={task.location}
            type="text"
          >
            <option value="Hall, stairs and Landing">Hall, stairs and Landing</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Bathroom">Bathroom</option>
            <option value="Back Bedroom">Back Bedroom</option>
            <option value="Study">Study</option>
            <option value="Lounge">Lounge</option>
            <option value="Dining room">Dining room</option>
            <option value="Utility Room">Utility Room</option>
            <option value="Garage">Garage</option>
            <option value="Cats">Cats</option>
            <option value="Laundry">Laundry</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div>
          <label>Date last completed</label>
          <input
            className="taskFormInput"
            name="dateCompleted"
            onChange={this.handleFormFieldChange}
            value={task.dateCompleted}
            type="date"
          />
        </div>

        <button className="submitButton" disabled={saveTaskStatus === ACTION_STATUS_SUCCEEDED} type="submit">
          Save
        </button>
        <br/>

        {taskId && (
          <button className="deleteButton" type="delete" onClick={this.handleDeleteTaskClick}>
            Delete task
          </button>
        )}
      </form>
    )
  }
}

const EditWithRouterProps = (props) => <Edit params={useParams()} navigate={useNavigate()} {...props} />

export default EditWithRouterProps
