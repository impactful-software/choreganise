import './Completion.css'
import { Fragment, useRef, useState } from 'react'
import IconButton from '../IconButton'
import { getUnixTime } from 'date-fns'
import { noop } from 'lodash'

const Completion = ({
  completion,
  onChange,
  onDelete,
  forceEdit = false,
  onCancelEdit = noop
}) => {
  const allowDelete = (typeof onDelete === 'function')
  const initialDurationMinutes = completion.duration ? Math.ceil(completion.duration / 60) : ''

  const [date, setDate] = useState(new Date(1000 * completion.time || 0))
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes)
  const [editing, setEditing] = useState(!!forceEdit)
  const formId = useRef(`${completion.time}_${completion.duration}`)

  const handleDateChange = (event) => setDate(new Date(event.target.value))
  const handleDurationChange = (event) => setDurationMinutes(+event.target.value)

  const handleClickDelete = () => {
    setEditing(false)
    onDelete()
  }

  const startEditing = () => setEditing(true)

  const stopEditing = () => {
    setEditing(false)
    setDurationMinutes(initialDurationMinutes)
    onCancelEdit()
  }

  const save = () => {
    setEditing(false)
    onChange({
      ...completion,
      time: getUnixTime(date),
      duration: +durationMinutes * 60
    })
  }

  return (
    <tr className="tableRow completion">
      <td className="tableCell">
          {editing ? (
            <input
              className="input date"
              form={formId.current}
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
      </td>

      <td className="tableCell">
        {editing ? (
          <Fragment>
            <input
              className="input duration"
              form={formId.current}
              name="duration"
              onChange={handleDurationChange}
              type="number"
              value={durationMinutes}
            />
            <span className="durationUnits">
              &nbsp;minutes
            </span>
          </Fragment>
        ) : +durationMinutes > 0 && (
          <Fragment>
            <span className="duration">
              {durationMinutes}
            </span>
            <span className="durationUnits">
              &nbsp;minutes
            </span>
          </Fragment>
          )}
      </td>

      <td className="tableCell controls">
        <form id={formId.current}>
          {editing ? (
            <Fragment>
              <span className="control">
                <IconButton icon="undo" type="reset" onClick={stopEditing} />
              </span>
              <span className="control">
                <IconButton icon="save" type="submit" onClick={save} />
              </span>
            </Fragment>
          ) : (
            <Fragment>
              <span className="control">
                <IconButton icon="pencil" onClick={startEditing} />
              </span>
              {allowDelete && (
                <span className="control">
                  <IconButton icon="trash" onClick={handleClickDelete} />
                </span>
              )}
            </Fragment>
          )}
        </form>
      </td>
    </tr>
  )
}

export default Completion
