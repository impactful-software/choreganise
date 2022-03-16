import './List.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED, ACTION_STATUS_SUCCEEDED } from '../utility/config.js'
import calculateTaskPriority from '../utility/calculateTaskPriority.js'
import { fetchTasks } from '../store/taskListSlice.js'
import { useRealmApp } from '../components/RealmApp.js'
import { Option } from '../components/Form'
import { getDateString, getTimeString } from '../utility/dateTimeFunctions'

function View ({ taskList }) {
  const { db } = useRealmApp()
  const dispatch = useDispatch()
  const status = useSelector(state => state.taskList.status)
  const tasks = useSelector(state => state.taskList.tasks).map(
    task => ({
      prioritisedDate: new Date(task.prioritise),
      priority: Math.round(calculateTaskPriority(task)),
      task
    })
  )

  useEffect(() => {
    if (status.fetchTasks === ACTION_STATUS_IDLE && tasks.length === 0) {
      dispatch(fetchTasks({ db }))
    }
  })

  return (
    <div className="listPage">
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
        <table className="table">
          <thead>
            <tr className="tableHeadingRow">
              <th className="tableCell" colSpan="2"></th>
              <th className="tableCell taskColumn">Task</th>
              <th className="tableCell locationColumn" colSpan="2">
                <select className="selectRoom" type="text" name="taskLocation" defaultValue=''>
                  <Option value="">Location</Option>
                  <Option value="hallLanding">Hall, stairs and Landing</Option>
                  <Option value="kitchen">Kitchen</Option>
                  <Option value="bathroom">Bathroom</Option>
                  <Option value="backBedroom">Back Bedroom</Option>
                  <Option value="study">Study</Option>
                  <Option value="lounge">Lounge</Option>
                  <Option value="utilityRoom">Utility Room</Option>
                  <Option value="garage">Garage</Option>
                  <Option value="cats">Cats</Option>
                  <Option value="laundry">Laundry</Option>
                  <Option value="food">Food</Option>
                  <Option value="shopping">Shopping</Option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(({ prioritisedDate, priority, task }) => (
              <tr key={task._id}>
                <td className="tableCell iconColumn">
                  {task.prioritise ? (
                    <FontAwesomeIcon
                      icon="flag"
                      title={`Prioritised at ${getTimeString(prioritisedDate)} on ${getDateString(prioritisedDate)}`}
                    />
                  ) : ''}
                </td>
                <td className="tableCell iconColumn" title={`Priority score: ${priority}`}>
                  {priority < 100 ? priority : <FontAwesomeIcon icon='infinity' />}
                </td>
                <td className="tableCell taskColumn">
                  {task.name}
                </td>
                <td className="tableCell locationColumn">
                  {task.location}
                </td>
                <td className="tableCell iconColumn">
                  <Link to={`/task/${task._id}`}>
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
