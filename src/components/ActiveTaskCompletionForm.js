import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { completeTask, selectTimeSpentOnCurrentTask } from "../store/timerSlice"
import { useRealmApp } from "./RealmApp"
import TaskCompletionForm from "./TaskCompletionForm"

const ActiveTaskCompletionForm = ({ onSubmit, task }) => {
  const dispatch = useDispatch()

  const { db } = useRealmApp()

  const activeTask = useSelector(state => state.timer.activeTask)
  const duration = useSelector(selectTimeSpentOnCurrentTask)

  const handleCompletionFormSubmit = useCallback(({ duration, time }) => {
    dispatch(completeTask({ db, duration, task, time }))
    onSubmit()
  }, [db, dispatch, onSubmit, task])

  return (
    <TaskCompletionForm
      completion={{ duration }}
      onSubmit={handleCompletionFormSubmit}
      task={activeTask}
    />
  )
}

export default ActiveTaskCompletionForm
