import './Edit.css'
import { BSON } from 'realm-web'
import { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { mean } from 'lodash'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED, ACTION_STATUS_SUCCEEDED } from '../utility/config.js'
import { defaultTask, decodeTask, resetTasks, encodeTask } from '../store/taskListSlice.js'
import { RealmAppContext } from '../components/RealmApp.js'
import CompletionList from '../components/edit/CompletionList'
import { Button, Fieldset, Form, Input, Label, Select, Option, CheckButton } from '../components/Form'
import Theme from '../components/Theme'
import Container from '../components/Container'
import { getTime } from 'date-fns'

class EditClass extends Component {
  static contextType = RealmAppContext

  constructor (props) {
    super(props)

    this.state = {
      deleted: false,
      fetchTaskStatus: ACTION_STATUS_IDLE,
      saveTaskStatus: ACTION_STATUS_SUCCEEDED,
      task: defaultTask
    }

    this.handleCompletionsUpdate = this.handleCompletionsUpdate.bind(this)
    this.handleDeleteTaskClick = this.handleDeleteTaskClick.bind(this)
    this.handleFormFieldChange = this.handleFormFieldChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handlePrioritiseChange = this.handlePrioritiseChange.bind(this)

    this.unmounting = false
  }

  async componentDidMount () {
    this.realm = this.context
    this.tasksCollection = this.realm.db.collection('tasks')
    this.fetchTask()
  }

  async componentWillUnmount () {
    this.unmounting = true

    if (this.changeStream) {
      const { taskId } = this.props.params
      console.debug(`Closing watch stream for task ${taskId}.`, this.changeStream)
      const result = await this.changeStream.return()
      console.debug(`CLOSED watch stream for task ${taskId}.`, result, this.changeStream)
    }
  }

  async componentDidUpdate (prevProps, prevState) {
    if (this.state.deleted && !prevState.deleted) {
      await this.changeStream.return()
    }

    if (this.props.params !== prevProps.params) {
      this.fetchTask()
    }
  }

  async fetchTask () {
    const { taskId } = this.props.params

    if (taskId) {
      this.setState({ fetchTaskStatus: ACTION_STATUS_LOADING })
      const task = decodeTask(await this.tasksCollection.findOne({_id: BSON.ObjectID(taskId)}))

      if (this.unmounting) {
        // Avoid triggering state changes if the component is unmounting after the API call completes
        return
      }

      if (task === null) {
        toast.error('Task not found. Submitting this form will create a new task.')
        this.setState({ fetchTaskStatus: ACTION_STATUS_REJECTED })
      } else {
        console.debug('Task found, creating a watch stream.', task)

        this.setState({
          fetchTaskStatus: ACTION_STATUS_SUCCEEDED,
          task
        })

        this.watchTask(taskId)
      }
    } else {
      this.setState({
        fetchTaskStatus: ACTION_STATUS_SUCCEEDED,
        task: {...defaultTask}
      })
    }
  }

  async handleCompletionsUpdate (completions) {
    const { deleted } = this.state
    const { taskId } = this.props.params

    if (taskId && !deleted) {
      this.setState({ saveTaskStatus: ACTION_STATUS_LOADING })

      const encodedData = encodeTask({ completions })

      await this.tasksCollection.updateOne(
        { _id: BSON.ObjectID(taskId) },
        {
          $set: {
            completions: encodedData.completions
          }
        }
      )

      this.setState({ saveTaskStatus: ACTION_STATUS_SUCCEEDED })
      toast.success('Task updated.')
    } else {
      console.error('Failed to update completions - task does not exist.')
      toast.error('Failed to update completions - task does not exist.')
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

  async handleFieldChange (fieldName, value) {
    this.setState({
      saveTaskStatus: ACTION_STATUS_IDLE,
      task: {
        ...this.state.task,
        [fieldName]: value
      }
    })
  }

  async handleFormFieldChange (event) {
    switch (event.target.type) {
      case 'checkbox':
        this.handleFieldChange(event.target.name, event.target.checked)
        break
      default:
        this.handleFieldChange(event.target.name, event.target.value)
    }
  }

  async handleFormSubmit (event) {
    event.preventDefault()

    const { deleted, task } = this.state
    const { navigate, params } = this.props
    const { taskId } = params

    const formData = new FormData(event.target)
    const data = {
      "name": formData.get('name'),
      "icon": formData.get('icon'),
      "prioritise": formData.has('prioritise'),
      "duration": +formData.get('duration'),
      "frequency": +formData.get('frequency'),
      "frequencyUnit": formData.get('frequencyUnit'),
      "location": formData.get('location'),
      "completions": task.completions
    }

    if (taskId && !deleted) {
      this.setState({ saveTaskStatus: ACTION_STATUS_LOADING })

      const encodedData = encodeTask(Object.assign({}, task, data))

      await this.tasksCollection.updateOne({ _id: BSON.ObjectID(taskId) }, encodedData)

      this.setState({ saveTaskStatus: ACTION_STATUS_SUCCEEDED })
      toast.success('Task updated.')

      this.props.dispatch(resetTasks())
    } else {
      this.setState({ saveTaskStatus: ACTION_STATUS_LOADING })

      const { insertedId } = await this.tasksCollection.insertOne(data)

      this.setState({
        deleted: false,
        saveTaskStatus: ACTION_STATUS_SUCCEEDED
      })
      toast.success('Task created.')

      this.props.dispatch(resetTasks())

      navigate(`./${insertedId}`)
    }
  }

  async handlePrioritiseChange (event) {
    const { taskId } = this.props.params

    await this.tasksCollection.updateOne(
      { _id: BSON.ObjectID(taskId) },
      {
        $set: {
          prioritise: event.target.checked ? getTime(new Date()) : null
        }
      }
    )
  }

  async watchTask (taskId) {
    this.changeStream = this.tasksCollection.watch({ ids: [BSON.ObjectID(taskId)]})

    for await (const event of this.changeStream) {
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
          console.debug('Task updated.', event, this.changeStream)
          this.setState({ task: event.fullDocument })
          break
        }

        case 'delete': {
          console.debug('Task deleted.', event, this.changeStream)
          this.setState({ deleted: true })
          break
        }

        default: {
          console.debug('Unexpected task operation received.', event, this.changeStream)
        }
      }
    }
  }

  render () {
    const { fetchTaskStatus, saveTaskStatus, task } = this.state
    const { taskId } = this.props.params
    const completionDurations = task.completions
      .filter(completion => completion.duration !== null)
      .map(completion => +completion.duration)
    const averageDuration = mean(completionDurations)

    return fetchTaskStatus === ACTION_STATUS_LOADING || (fetchTaskStatus === ACTION_STATUS_IDLE && taskId) ? (
      <p>
        <FontAwesomeIcon icon="spinner" spin />
      </p>
    ) : fetchTaskStatus === ACTION_STATUS_REJECTED ? (
      <p>
        Error finding task details.
      </p>
    ) : (
      <Container className="editTaskPage">
        <Form action="/view" onSubmit={this.handleFormSubmit}>
          <div>
            <Label>Icon</Label>
            <p className="note">
              Enter the name of a <a href="https://fontawesome.com/v5/cheatsheet" rel="noreferrer" target="_blank">free, solid Font Awesome icon</a>.
            </p>
            <Input
              name="icon"
              onChange={this.handleFormFieldChange}
              placeholder="Font Awesome icon name"
              value={task.icon}
              type="text"
            />
          </div>

          <div>
            <Label>Do this</Label>
            <Input
              name="name"
              onChange={this.handleFormFieldChange}
              placeholder="task"
              value={task.name}
              type="text"
            />
          </div>

          <div>
            <Label>in/at the</Label>
            <Select
              name="location"
              onChange={this.handleFormFieldChange}
              required
              type="text"
              value={task.location}
            >
              <Option disabled value="">location/category</Option>
              <Option value="hall, stairs and landing">Hall, stairs and landing</Option>
              <Option value="kitchen">Kitchen</Option>
              <Option value="bathroom">Bathroom</Option>
              <Option value="back bedroom">Back bedroom</Option>
              <Option value="study">Study</Option>
              <Option value="lounge">Lounge</Option>
              <Option value="dining room">Dining room</Option>
              <Option value="utility Room">Utility room</Option>
              <Option value="garage">Garage</Option>
              <Option value="cats">Cats</Option>
              <Option value="food">Food</Option>
            </Select>
          </div>

          <div>
            <Label>every</Label>
            <Fieldset inline>
              <Input
                className="frequencyNumberInput"
                name="frequency"
                onChange={this.handleFormFieldChange}
                placeholder="number"
                value={task.frequency}
                type="number"
              />
              <Select
                onChange={this.handleFormFieldChange}
                name="frequencyUnit"
                type="text"
                value={task.frequencyUnit}
              >
                <Option value="days">day(s)</Option>
                <Option value="weeks">week(s)</Option>
                <Option value="months">month(s)</Option>
                <Option value="years">year(s)</Option>
              </Select>
            </Fieldset>
          </div>

          <div>
            <Label>for</Label>
            <Fieldset inline>
              <Input
                className="durationInput"
                name="duration"
                onChange={this.handleFormFieldChange}
                placeholder="duration"
                type="number"
                value={task.duration}
              />
              <span>
                minutes
              </span>
            </Fieldset>
            <p className="note">
              Actual average:&nbsp;
              {completionDurations.length ? (
                Math.ceil(averageDuration / 60).toString() + ' minutes'
              ) : (
                "not yet measured"
              )}
            </p>
          </div>

          <div className="buttonsWrap">
            <Theme success>
              <Button disabled={saveTaskStatus === ACTION_STATUS_SUCCEEDED} type="submit">
                Save
              </Button>
            </Theme>

            <Theme accent>
              <CheckButton
                checked={!!task.prioritise}
                name="prioritise"
                onChange={this.handlePrioritiseChange}
              >
                Prioritise
              </CheckButton>
            </Theme>

            {taskId && (
              <Theme danger>
                <Button type="delete" onClick={this.handleDeleteTaskClick}>
                  Delete task
                </Button>
              </Theme>
            )}
          </div>
        </Form>

        <section className="completions">
          {task.completions.length === 0 ? (
            <p className="placeholder">Not yet completed.</p>
          ) : (
            <Label>Completed {task.completions.length} times</Label>
          )}
          <CompletionList
            completions={task.completions}
            onChange={this.handleCompletionsUpdate}
          />
        </section>
      </Container>
    )
  }
}

const Edit = (props) =>
  <EditClass
    dispatch={useDispatch()}
    navigate={useNavigate()}
    params={useParams()}
    {...props}
  />

export default Edit
