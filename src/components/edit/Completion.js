import './Completion.css'
import { Fragment, useState } from 'react'
import IconButton from '../IconButton'
import { getUnixTime } from 'date-fns'
import { noop } from 'lodash'

const Completion = ({
  completion,
  onChange,
  forceEdit = false,
  onCancelEdit = noop
}) => {
  const initialDurationMinutes = completion.duration ? Math.ceil(completion.duration / 60) : null

  const [date, setDate] = useState(new Date(1000 * completion.time || 0))
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes)
  const [editing, setEditing] = useState(!!forceEdit)

  const handleDateChange = (event) => setDate(new Date(event.target.value))

  const handleDurationChange = (event) => setDurationMinutes(+event.target.value)

  const startEditing = () => setEditing(true)

  const stopEditing = () => {
    setEditing(false)
    setDurationMinutes(initialDurationMinutes)
    onCancelEdit()
  }

  const save = () => {
    onChange({
      ...completion,
      time: getUnixTime(date),
      duration: +durationMinutes * 60
    })
    setEditing(false)
  }

  return (
    <div className="completion">
      <span className="dateWrap">
          {editing ? (
            <input
              className="input date"
              name="date"
              onChange={handleDateChange}
              type="date"
              value={date.toISOString().slice(0,10)}
            />
          ) : (
            <span className="date">
              {date.toLocaleDateString()}
            </span>
          )}
        {}
      </span>

      <span className="durationWrap">
        {editing ? (
          <Fragment>
            <input
              className="input duration"
              name="duration"
              onChange={handleDurationChange}
              type="number"
              value={durationMinutes === null ? '' : durationMinutes}
            />
            <span className="durationUnits">
              &nbsp;minutes
            </span>
          </Fragment>
        ) : completion.duration && (
          <Fragment>
            <span className="duration">
              {durationMinutes}
            </span>
            <span className="durationUnits">
              &nbsp;minutes
            </span>
          </Fragment>
          )}
      </span>

      <span className="controls">
        <span className="control">
          {editing ? (
            <IconButton icon='undo' onClick={stopEditing} />
          ) : (
            <IconButton icon='pencil' onClick={startEditing} />
          )}
        </span>
        <span className={`control ${!editing && 'hidden'}`}>
          <IconButton disabled={!editing} icon="save" onClick={save} />
        </span>
      </span>
    </div>
  )
}

export default Completion
