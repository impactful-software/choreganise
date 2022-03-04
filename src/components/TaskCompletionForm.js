import "./TaskCompletionForm.css"
import { getTime } from "date-fns"
import { noop } from "lodash"
import { useCallback, useState } from "react"
import { createTaskCompletion } from "../store/taskListSlice"
import IconButton from "./IconButton"

const TaskCompletionForm = ({ completion, onSubmit = noop }) => {
  const [date, setDate] = useState(completion.date || new Date().toISOString().slice(0, 10))
  const [duration, setDuration] = useState(Math.floor(completion.duration / 60))

  const handleChangeDate = (event) => {
    setDate(event.target.value)
  }

  const handleChangeDuration = (event) => {
    setDuration(+event.target.value)
  }

  const handleSubmit = useCallback(event => {
    event.preventDefault()

    const theDate = new Date(date)
    const time = getTime(new Date(date))

    onSubmit({
      duration: +duration * 60,
      time
    })
  }, [date, duration, onSubmit])

  return (
    <form className="taskCompletionForm" onSubmit={handleSubmit}>
      <h2>Chore complete!</h2>

      <label className="taskCompletionFormField">
        Date
        <input
          name="date"
          onChange={handleChangeDate}
          type="date"
          value={date}
        />
      </label>

      <label className="taskCompletionFormField">
        Duration
        <input
          name="duration"
          onChange={handleChangeDuration}
          type="number"
          value={duration}
        />
      </label>

      <div className="taskCompletionFormControls">
        <IconButton dark icon="check" type="submit" />
      </div>
    </form>
  )
}

export default TaskCompletionForm
