import './Edit.css'
import { Link, useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCheckCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

function Edit (props) {
  const params = useParams()
  const {taskId} = params
  const task = {}

  if (taskId) {
    Object.assign(task, props.taskList.findById(taskId))
  }

  function handleFormSubmit (event) {
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

    Object.assign(task, data)

    console.debug({task})

    props.taskList.update(task)
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
      <div className="page">
        <section className='taskInputForm'>
          <form action="/view" className="editTaskForm" onSubmit={handleFormSubmit}>
            <div>
              <label>Task name</label>
              <input className="taskFormInput" type="text" placeholder="enter name of task" name="name" defaultValue={task.name} />
            </div>

            <div>
              <label>Prioritise</label>
              <input className="prioritise" type="checkbox" name="prioritise" defaultValue={task.prioritise} />
            </div>

            <div>
              <label>Duration</label>
              <input className="taskFormInput" type="text" placeholder="hh:mm:ss" name="duration" defaultValue={task.duration} />
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
              submit
            </button>
            <br/>
            <button className="deleteButton" type="delete">
              Delete task
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Edit