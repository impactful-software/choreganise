import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import convertSecondsToTimeString from '../utility/convertSecondsToTimeString'
import { fetchTasks, selectPrioritisedTasks } from '../store/taskListSlice'
import { useRealmApp } from '../components/RealmApp'
import './ActiveTask.css'
import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED } from '../utility/config'
import toast from 'react-hot-toast'

function ActiveTask () {
  const { db } = useRealmApp()
  const dispatch = useDispatch()

  const fetchTasksStatus = useSelector(state => state.taskList.status)
  const allTasks = useSelector(selectPrioritisedTasks)

  const [deleted, setDeleted] = useState(false)
  const [sessionTasks, setSessionTasks] = useState([])
  const [task, setCurrentTask] = useState({})
  const tasksCollection = db.collection('tasks')

  useEffect(() => {
    if (fetchTasksStatus === ACTION_STATUS_IDLE && allTasks.length === 0) {
      dispatch(fetchTasks({ db }))
    }
  }, [allTasks, db, dispatch, fetchTasksStatus])

  useEffect(() => {
    setSessionTasks([...allTasks])
  }, [allTasks, setSessionTasks])

  useEffect(() => {
    setCurrentTask(sessionTasks.length ? sessionTasks[0] : {})
  }, [sessionTasks, setCurrentTask])

  useEffect(() => {
    async function watchTask (watchStream) {
      for await (const change of watchStream) {
        switch (change.operationType) {
          case 'update':
          case 'replace': {
            console.debug('Task updated, refreshing task list.', change, watchStream)
            dispatch(fetchTasks({ db }))
            break
          }

          case 'delete': {
            console.debug('Task deleted.', change, watchStream)
            setDeleted(true)
            toast.error('This task has been deleted. Saving this form will create a new task.')
            break
          }

          default: {
            console.debug('Unexpected task operation received.', change, watchStream)
          }
        }
      }
    }

    if (task._id && !deleted) {
      console.debug(`Creating a watch stream for task ${task._id}.`)

      const watchStream = tasksCollection.watch({}, [task._id])
      watchTask(watchStream)

      return async function cleanup () {
        const result = await watchStream.return()
        console.debug(`Cleaned up watch stream for task ${task._id}.`, { result, watchStream })
      }
    }
  }, [db, deleted, dispatch, fetchTasksStatus, task, tasksCollection])

  return fetchTasksStatus === ACTION_STATUS_IDLE || fetchTasksStatus === ACTION_STATUS_LOADING ? (
    <p>Loading.</p>
  ) : fetchTasksStatus === ACTION_STATUS_REJECTED ? (
    <p>Error loading tasks.</p>
  ) : !task._id ? (
    <p>No tasks found that are due and fit within the remaining session time.</p>
  ) : (
    <section className="activeTask">
      <div className="locationAndDuration">
        <div className="taskLocation">
          <FontAwesomeIcon icon='hourglass-start' />
          &nbsp;
          {convertSecondsToTimeString(task.duration)}
        </div>
        <div className="taskLocation">
          {task.location}
        </div>
      </div>
      <div className="taskNameAndIcon">
        <div className="taskIcon">
          {task.icon && <FontAwesomeIcon icon={task.icon} />}
        </div>
        <div className="taskName">
          {task.name}
        </div>
      </div>
    </section>
  )
}

export default ActiveTask
