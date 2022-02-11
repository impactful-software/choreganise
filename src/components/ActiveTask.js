import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchTasks } from '../store/taskListSlice'
import { useRealmApp } from '../components/RealmApp'
import './ActiveTask.css'
import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED } from '../utility/config'
import toast from 'react-hot-toast'
import { startNextTask } from '../store/timerSlice'

function ActiveTask () {
  const dispatch = useDispatch()

  const { db } = useRealmApp()
  const tasksCollection = db.collection('tasks')

  const activeTask = useSelector(state => state.timer.activeTask)
  const fetchTasksStatus = useSelector(state => state.taskList.status.fetchTasks)
  const tasks = useSelector(state => state.taskList.tasks)

  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    if (fetchTasksStatus === ACTION_STATUS_IDLE) {
      dispatch(fetchTasks({ db }))
    }
  }, [db, dispatch, fetchTasksStatus])

  useEffect(() => {
    if (tasks.length) {
      dispatch(startNextTask(tasks))
    }
  }, [dispatch, tasks])

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

    if (activeTask && !deleted) {
      console.debug(`Creating a watch stream for task ${activeTask._id}.`)

      const watchStream = tasksCollection.watch({}, [activeTask._id])
      watchTask(watchStream)

      return async function cleanup () {
        const result = await watchStream.return()
        console.debug(`Cleaned up watch stream for task ${activeTask._id}.`, { result, watchStream })
      }
    }
  }, [db, deleted, dispatch, activeTask, tasksCollection])

  return fetchTasksStatus === ACTION_STATUS_IDLE || fetchTasksStatus === ACTION_STATUS_LOADING ? (
    <p>Loading.</p>
  ) : fetchTasksStatus === ACTION_STATUS_REJECTED ? (
    <p>Error loading tasks.</p>
  ) : !activeTask ? (
    <p>No tasks found that are due and fit within the remaining session time.</p>
  ) : (
    <section className="activeTask">
      <div className="locationAndDuration">
        <div className="taskLocation">
          <FontAwesomeIcon icon='hourglass-start' />
          &nbsp;
          {activeTask.duration}
        </div>
        <div className="taskLocation">
          {activeTask.location}
        </div>
      </div>
      <div className="taskNameAndIcon">
        <div className="taskIcon">
          {activeTask.icon && <FontAwesomeIcon icon={activeTask.icon} />}
        </div>
        <div className="taskName">
          {activeTask.name}
        </div>
      </div>
    </section>
  )
}

export default ActiveTask
