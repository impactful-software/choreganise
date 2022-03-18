import './List.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED, ACTION_STATUS_SUCCEEDED } from '../utility/config.js'
import calculateTaskPriority from '../utility/calculateTaskPriority.js'
import { fetchTasks } from '../store/taskListSlice.js'
import { useRealmApp } from '../components/RealmApp.js'
import { getDateString, getTimeString } from '../utility/dateTimeFunctions'
import Loading from '../components/Loading'

function List () {
  const { db } = useRealmApp()
  const dispatch = useDispatch()

  const status = useSelector(state => state.taskList.status)
  const tasks = useSelector(state => state.taskList.tasksMatchingFilter)

  const taskList = tasks.map(
    task => ({
      boostedDate: new Date(task.boostedAt),
      priority: Math.round(calculateTaskPriority(task)),
      task
    })
  )

  useEffect(() => {
    if (status.fetchTasks === ACTION_STATUS_IDLE) {
      dispatch(fetchTasks({ db }))
    }
  })

  return (
    <div className="listPage">
      {Object.values(status).indexOf(ACTION_STATUS_LOADING) !== -1 && (
        <Loading />
      )}

      {status.fetchTasks === ACTION_STATUS_REJECTED && (
        <p>Failed to load task list.</p>
      )}

      {status.fetchTasks === ACTION_STATUS_SUCCEEDED && (!taskList || taskList.length === 0) && (
        <p>No tasks found.</p>
      )}

      {taskList.length > 0 && (
        <table className="table">
          <thead>
            <tr className="tableHeadingRow">
              <th className="tableCell" colSpan="2">
                Priority
              </th>
              <th className="tableCell taskColumn">
                Task
              </th>
              <th className="tableCell categoryColumn" colSpan="2">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {taskList.map(({ boostedDate, priority, task }) => (
              <tr key={task._id}>
                <td className="tableCell iconColumn">
                  {boostedDate > 0 ? (
                    <FontAwesomeIcon
                      icon="flag"
                      title={`Prioritised at ${getTimeString(boostedDate)} on ${getDateString(boostedDate)}`}
                    />
                  ) : ''}
                </td>
                <td className="tableCell iconColumn" title={`Priority score: ${priority}`}>
                  {priority < 100 ? priority : <FontAwesomeIcon icon='infinity' />}
                </td>
                <td className="tableCell taskColumn">
                  {task.name}
                </td>
                <td className="tableCell categoryColumn">
                  {task.category}
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

export default List
