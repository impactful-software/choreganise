import './View.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchTasks } from '../store/taskListSlice'
import { useRealmApp } from '../components/RealmApp'
import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED, ACTION_STATUS_SUCCEEDED } from '../utility/config'
import calculateTaskPriority from '../utility/calculateTaskPriority'

function View ({ taskList }) {
  const { db } = useRealmApp()
  const dispatch = useDispatch()
  const status = useSelector(state => state.taskList.status)
  const tasks = useSelector(state => state.taskList.tasks)

  useEffect(() => {
    if (status.fetchTasks === ACTION_STATUS_IDLE && tasks.length === 0) {
      dispatch(fetchTasks({ db }))
    }
  })

  return (
    <div className="viewPage">
      {Object.values(status).indexOf(ACTION_STATUS_LOADING) !== -1 && (
        <p className="loading">
          <FontAwesomeIcon icon='spinner' spin />
        </p>
      )}

      {status.fetchTasks === ACTION_STATUS_REJECTED && (
        <p>Failed to load task list.</p>
      )}

      {status.fetchTasks === ACTION_STATUS_SUCCEEDED && (!tasks || tasks.length === 0) && (
        <p>No tasks found.</p>
      )}

      {status.fetchTasks === ACTION_STATUS_SUCCEEDED && (
        <table>
          <thead>
            <tr>
              <th>Priority</th>
              <th className="taskColumn">Task</th>
              <th className="locationColumn">
                <select className="selectRoom" type="text" name="taskLocation" defaultValue=''>
                  <option value="" disabled>Location</option>
                  <option value="hallLanding">Hall, stairs and Landing</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="backBedroom">Back Bedroom</option>
                  <option value="study">Study</option>
                  <option value="lounge">Lounge</option>
                  <option value="utilityRoom">Utility Room</option>
                  <option value="garage">Garage</option>
                  <option value="cats">Cats</option>
                  <option value="laundry">Laundry</option>
                  <option value="food">Food</option>
                  <option value="shopping">Shopping</option>
                </select>
              </th>
              <th className="iconColumn"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id}>
                <td>
                  {calculateTaskPriority(task).toFixed(1)}
                </td>
                <td className="taskColumn">
                  {task.name}
                </td>
                <td className="locationColumn">
                  {task.location}
                </td>
                <td className="iconColumn">
                  <Link to={`/edit/${task._id}`}>
                    <FontAwesomeIcon icon='edit' />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default View
