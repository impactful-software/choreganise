import './Completion.css'
import { useState } from 'react'
import IconButton from '../IconButton'

const Completion = ({ completion, onChange }) => {
  const [editing, setEditing] = useState(false)
  const [durationMinutes, setDurationMinutes] = useState(Math.ceil(completion.duration / 60))

  const completionDate = new Date(1000 * completion.time || 0)

  const handleDurationChange = (event) => setDurationMinutes(+event.target.value)

  const startEditing = () => setEditing(true)

  const stopEditing = () => {
    setEditing(false)
    setDurationMinutes(+Math.ceil(completion.duration / 60))
  }

  const save = () => {
    onChange({
      ...completion,
      duration: durationMinutes * 60
    })
    setEditing(false)
  }

  return (
    <li className="completion">
      <span className="date">
        {completionDate.toLocaleDateString()}
      </span>

      {completion.duration && (
        <span className="durationWrap">
          {editing ? (
            <input
              className="input duration"
              name="duration"
              onChange={handleDurationChange}
              type="number"
              value={durationMinutes}
            />
          ) : (
            <span className="duration">
              {durationMinutes}
            </span>
          )}
          &nbsp;minutes
        </span>
      )}

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
    </li>
  )
}

export default Completion
