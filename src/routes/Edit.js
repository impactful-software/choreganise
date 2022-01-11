import './Edit.css'
import { BSON } from 'realm-web'
import { CSSTransition } from 'react-transition-group'
import { faHome, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useEffect, useRef, useState } from 'react'

function Edit ({ taskList }) {
  const params = useParams()
  const {taskId} = params

  const [deleted, setDeleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const messageWrap = useRef(null)
  const [messageActive, setMessageActive] = useState(false)
  const [task, setTask] = useState({})

  useEffect(() => {
    async function fetchTask() {
      if (!deleted) {
        setLoading(true)
        const task = await taskList.findById(taskId)
        if (task === null) {
          setMessage('This task does not exist. It may have been deleted.')
        } else {
          setTask(task)
        }
        setLoading(false)
      }
    }

    fetchTask()
  }, [deleted, taskId, taskList])

  useEffect(() => {
    const watchStream = taskList.watch({ids: [BSON.ObjectID(taskId)]})

    console.debug(`Created watch stream for task ${taskId}`)

    async function watchTask () {
      for await (const change of watchStream) {
        switch (change.operationType) {
          case 'update':
          case 'replace': {
            console.debug('Task updated.', change, watchStream)
            setTask(change.fullDocument)
            break
          }

          case 'delete': {
            console.debug('Task deleted.', change, watchStream)
            setDeleted(true)
            renderTemporaryMessage('This task has been deleted. Saving this form will create a new task.')
            break
          }

          default: {
            console.debug('Unexpected task operation received.', change, watchStream)
          }
        }
      }
    }

    watchTask()

    return async function cleanup () {
      const result = await watchStream.return()
      console.debug('Cleaned up watch stream.', watchStream, result)
    }
  }, [taskId, taskList])

  async function deleteTask (event) {
    event.preventDefault()

    if (taskId) {
      await taskList.deleteById(taskId)
      renderTemporaryMessage('Task deleted.')
    } else {
      console.error('Cannot delete a task before it is created.')
    }
  }

  async function handleFormSubmit (event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = {
      "name": formData.get('name'),
      "prioritise": formData.has('prioritise'),
      "duration": formData.get('duration'),
      "frequency": formData.get('frequency'),
      "frequencyUnit": formData.get('frequencyUnit'),
      "location": formData.get('location'),
      "dateCompleted": formData.get('dateCompleted')
    }


    if (taskId && !deleted) {
      Object.assign(task, data)
      await taskList.updateById(taskId, task)
      renderTemporaryMessage('Task updated.')
    } else {
      const {insertedId} = await taskList.create(data)

      setDeleted(false)
      renderTemporaryMessage('Task created.' + insertedId.toString())
    }
  }

  function renderTemporaryMessage (message) {
    setMessage(message)
    setMessageActive(true)
    setTimeout(() => {
      setMessageActive(false)
      setTimeout(() => setMessage(null), 500)
    }, 3000)
  }

  return (
    <div>
      <nav className="nextLinks">
        <Link to="/" className="homeLink">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link to="/view" className="alreadyDoneButton">
          <FontAwesomeIcon icon={faCheckCircle} />
        </Link>
      </nav>

      <div className="page editPage">
        <CSSTransition nodeRef={messageWrap} in={messageActive} timeout={3000} classNames="messageWrap">
          <div className="messageWrap" ref={messageWrap}>
            {message && (
              <p className="message">
                {message}
              </p>
            )}
          </div>
        </CSSTransition>

        {loading ? (
          <p>Loading.</p>
        ) : (
          <section className='taskInputForm'>
            <form action="/view" className="editTaskForm" onSubmit={handleFormSubmit}>
              <div>
                <label>Task name</label>
                <input className="taskFormInput" type="text" placeholder="enter name of task" name="name" defaultValue={task.name} />
              </div>

              <div>
                <label>Prioritise</label>
                <input className="prioritise" type="checkbox" name="prioritise" defaultChecked={task.prioritise} />
              </div>

              <div>
                <label>Duration</label>
                <input className="taskFormInput" type="time" placeholder="hh:mm:ss" name="duration" defaultValue={task.duration} />
              </div>

              <div>
                <label>Frequency</label>
                <input className="taskFormInput" type="number" placeholder="number" name="frequency" defaultValue={task.frequency} />
                <select className="taskFormInput" type="text"  name="frequencyUnit" defaultValue={task.frequencyUnit}>
                  <option value="days">Day(s)</option>
                  <option value="weeks">Week(s)</option>
                  <option value="months">Month(s)</option>
                  <option value="years">Year(s)</option>
                </select>
              </div>

              <div>
                <label>Location/Category</label>
                <select className="taskFormInput" type="text" name="location" defaultValue={task.location}>
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
                <input className="taskFormInput" type="date" name="dateCompleted" defaultValue={task.dateCompleted} />
              </div>

              <button className="submitButton" type="submit">
                Save
              </button>
              <br/>

              {taskId && (
                <button className="deleteButton" type="delete" onClick={deleteTask}>
                  Delete task
                </button>
              )}
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default Edit
