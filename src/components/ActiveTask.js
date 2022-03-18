import './ActiveTask.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'

import { ACTION_STATUS_IDLE, ACTION_STATUS_LOADING, ACTION_STATUS_REJECTED, ACTION_STATUS_SUCCEEDED } from '../utility/config.js'
import ActiveTaskCompletionForm from './ActiveTaskCompletionForm'
import { fetchTasks, prioritiseTasks } from '../store/taskListSlice.js'
import IconButton from './IconButton.js'
import Modal from './Modal'
import { setTasks as setSessionTasks, startNextTask } from '../store/timerSlice.js'
import { useRealmApp } from '../components/RealmApp.js'
import Loading from './Loading'

function ActiveTask () {
  const dispatch = useDispatch()

  const { db } = useRealmApp()
  const tasksCollection = db.collection('tasks')

  const activeTask = useSelector(state => state.timer.activeTask)
  const prioritisedTasks = useSelector(state => state.taskList.tasksMatchingFilter)
  const fetchTasksStatus = useSelector(state => state.taskList.status.fetchTasks)
  const sessionTasks = useSelector(state => state.timer.tasks)
  const updateTaskStatus = useSelector(state => state.taskList.status.updateTask)

  const [deleted, setDeleted] = useState(false)
  const [nextTaskRequired, setNextTaskRequired] = useState(false)
  const [showCompletionForm, setShowCompletionForm] = useState(false)

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
    // Fetch tasks if they haven't been fetched already
    if (fetchTasksStatus === ACTION_STATUS_IDLE) {
      dispatch(fetchTasks({ db }))
    }
  }, [db, dispatch, fetchTasksStatus])

  useEffect(() => {
    // Keep in sync with any changes made to tasks
    if (
      fetchTasksStatus === ACTION_STATUS_SUCCEEDED &&
      (updateTaskStatus === ACTION_STATUS_IDLE || updateTaskStatus === ACTION_STATUS_SUCCEEDED)
    ) {
      dispatch(setSessionTasks(prioritisedTasks))
      setNextTaskRequired(true)
    }
  }, [dispatch, fetchTasksStatus, prioritisedTasks, updateTaskStatus])

  useEffect(() => {
    // Progress through the session task list whenever a new task is required
    if (nextTaskRequired) {
      dispatch(startNextTask(sessionTasks))
      setNextTaskRequired(false)
    }
  }, [dispatch, nextTaskRequired, sessionTasks])

  useEffect(() => {
    // Keep in sync with any changes made to the active task
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
    // Reprioritise tasks if any have been updated
    if (updateTaskStatus === ACTION_STATUS_SUCCEEDED) {
      dispatch(prioritiseTasks())
    }
    if (updateTaskStatus === ACTION_STATUS_REJECTED) {
      toast.error('Failed to update task.')
    }
  }, [dispatch, updateTaskStatus])

  useEffect(() => {
    // Show an error if fetching tasks fails
    if (fetchTasksStatus === ACTION_STATUS_REJECTED) {
      toast.error('Failed to load task.')
    }
  }, [fetchTasksStatus])

  useEffect(() => {
    // Hide the task completion form whenever the active task changes
    setShowCompletionForm(false)
  }, [activeTask])

  const handleActiveTaskCompleted = () => {
    setNextTaskRequired(true)
  }

  return fetchTasksStatus === ACTION_STATUS_IDLE || fetchTasksStatus === ACTION_STATUS_LOADING ? (
    <Loading />
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
      <div className="durationAndCategory">
        <div className="duration">
          <FontAwesomeIcon icon='hourglass-start' />
          &nbsp;
          {activeTask.duration} minutes
        </div>
        <div className="category">
          {activeTask.category}
        </div>
      </div>
      <div>
        {activeTask.icon && (
          <div className="activeTaskIcon">
            <FontAwesomeIcon icon={activeTask.icon} />
          </div>
        )}
        <div className="name">
          {activeTask.name}
        </div>
      </div>
      <div className="activeTaskCompleteButton">
        <IconButton icon='check-circle' onClick={() => setShowCompletionForm(true)} />
      </div>
      {showCompletionForm && (
        <Modal theme="dark invert">
          <h2>
            Chore complete!
          </h2>
          <ActiveTaskCompletionForm onCancel={() => setShowCompletionForm(false)} onSubmit={handleActiveTaskCompleted} task={activeTask} />
        </Modal>
      )}
    </section>
  )
}

export default ActiveTask
