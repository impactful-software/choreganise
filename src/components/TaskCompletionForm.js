import "./TaskCompletionForm.css"
import { getTime } from "date-fns"
import { noop } from "lodash"
import { useCallback, useState } from "react"
import Form, { Button, Fieldset, Input, Label } from "./Form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Theme from "./Theme"

const TaskCompletionForm = ({ completion, onCancel = noop, onSubmit = noop }) => {
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

    onSubmit({
      duration: +duration * 60,
      time: getTime(new Date(date))
    })
  }, [date, duration, onSubmit])

  return (
    <Form className="taskCompletionForm" onSubmit={handleSubmit}>
      <Label>
        Date
      </Label>
      <Input
        name="date"
        onChange={handleChangeDate}
        type="date"
        value={date}
      />

      <Label>
        Duration
      </Label>
      <Fieldset inline>
        <Input
          name="duration"
          onChange={handleChangeDuration}
          type="number"
          value={duration}
        />
        <span>
          minutes
        </span>
      </Fieldset>

      <div className="taskCompletionFormControls">
        <Theme danger invert>
          <Button onClick={onCancel} type="button">
            <FontAwesomeIcon icon="rotate-left" /> Cancel
          </Button>
        </Theme>
        <Theme accent invert>
          <Button type="submit">
            <FontAwesomeIcon icon="save" /> Save
          </Button>
        </Theme>
      </div>
    </Form>
  )
}

export default TaskCompletionForm
