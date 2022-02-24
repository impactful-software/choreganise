import './ActiveTask.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'

import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED, ACTION_STATUS_SUCCEEDED } from '../utility/config.js'
import { fetchTasks, prioritiseTasks } from '../store/taskListSlice.js'
import { completeActiveTask, setTasks, startNextTask } from '../store/timerSlice.js'
import { useRealmApp } from '../components/RealmApp.js'
import IconButton from './IconButton.js'

function ActiveTask () {
  const dispatch = useDispatch()

  const { db } = useRealmApp()
  const tasksCollection = db.collection('tasks')

  const activeTask = useSelector(state => state.timer.activeTask)
  const allTasks = useSelector(state => state.taskList.tasks)
  const fetchTasksStatus = useSelector(state => state.taskList.status.fetchTasks)
  const sessionTasks = useSelector(state => state.timer.tasks)
  const updateTaskStatus = useSelector(state => state.taskList.status.updateTask)

  const [deleted, setDeleted] = useState(false)
  const [nextTaskRequired, setNextTaskRequired] = useState(false)

  const watchTask = useCallback(
    async (watchStream) => {
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
    },
    [db, dispatch]
  )

  useEffect(() => {
    if (fetchTasksStatus === ACTION_STATUS_IDLE) {
      dispatch(fetchTasks({ db }))
    }
  }, [db, dispatch, fetchTasksStatus])

  useEffect(() => {
    if (
      fetchTasksStatus === ACTION_STATUS_SUCCEEDED &&
      (updateTaskStatus === ACTION_STATUS_IDLE || updateTaskStatus === ACTION_STATUS_SUCCEEDED)
    ) {
      dispatch(setTasks(allTasks))
      setNextTaskRequired(true)
    }
  }, [dispatch, fetchTasksStatus, allTasks, updateTaskStatus])

  useEffect(() => {
    if (nextTaskRequired) {
      dispatch(startNextTask(sessionTasks))
      setNextTaskRequired(false)
    }
  }, [dispatch, nextTaskRequired, sessionTasks])

  useEffect(() => {
    if (activeTask && !deleted) {
      console.debug(`Creating a watch stream for task ${activeTask._id}.`)

      const watchStream = tasksCollection.watch({}, [activeTask._id])
      watchTask(watchStream)

      return async function cleanup () {
        const result = await watchStream.return()
        console.debug(`Cleaned up watch stream for task ${activeTask._id}.`, { result, watchStream })
      }
    }
  }, [db, deleted, dispatch, activeTask, tasksCollection, watchTask])

  useEffect(() => {
    if (updateTaskStatus === ACTION_STATUS_REJECTED) {
      toast.error('Failed to update task.')
    }
    if (updateTaskStatus === ACTION_STATUS_SUCCEEDED) {
      dispatch(prioritiseTasks())
    }
  }, [dispatch, updateTaskStatus])

  useEffect(() => {
    if (fetchTasksStatus === ACTION_STATUS_REJECTED) {
      toast.error('Failed to load task.')
    }
  }, [fetchTasksStatus])

  const handleDoneClick = useCallback(event => {
    dispatch(completeActiveTask({ db, props: activeTask }))
    setNextTaskRequired(true)
  }, [activeTask, db, dispatch])

  return fetchTasksStatus === ACTION_STATUS_IDLE || fetchTasksStatus === ACTION_STATUS_LOADING ? (
    <p>
      <FontAwesomeIcon icon="spinner" spin />
    </p>
  ) : fetchTasksStatus === ACTION_STATUS_REJECTED ? (
    <p>
      Error loading tasks.
    </p>
  ) : !activeTask ? (
    <p>
      No tasks found that are due and fit within the remaining session time.
    </p>
  ) : (
    <section className="activeTask">
      <div className="durationAndLocation">
        <div className="duration">
          <FontAwesomeIcon icon='hourglass-start' />
          &nbsp;
          {activeTask.duration} minutes
        </div>
        <div className="location">
          {activeTask.location}
        </div>
      </div>
      <div>
        {activeTask.icon && (
          <div className="icon">
            <FontAwesomeIcon icon={activeTask.icon} />
          </div>
        )}
        <div className="name">
          {activeTask.name}
        </div>
      </div>
      <div>
        <IconButton icon='check-circle' onClick={handleDoneClick} />
      </div>
    </section>
  )
}

export default ActiveTask
