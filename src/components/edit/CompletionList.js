import './CompletionList.css'
import Completion from './Completion'
import { useState } from 'react'
import { getUnixTime } from 'date-fns'

const CompletionList = ({ completions, onChange }) => {
  const [inserting, setInserting] = useState(false)

  const handleChange = (index, completion) => {
    const modifiedCompletions = [...completions]
    modifiedCompletions[index] = completion
    onChange(modifiedCompletions)
  }

  const hideInsertForm = () => {
    setInserting(false)
  }

  const showInsertForm = () => {
    setInserting(true)
  }

  const insert = (completion) => {
    hideInsertForm()
    const modifiedCompletions = [...completions, completion]
    onChange(modifiedCompletions)
  }

  return (
    <ul className="completionList">
      {completions.map((completion, index) => (
        <li key={index}>
          <Completion
            completion={completion}
            onChange={handleChange.bind(this, index)}
          />
        </li>
      ))}
      <li>
        {inserting ? (
          <Completion
            completion={{
              time: getUnixTime(new Date())
            }}
            forceEdit={true}
            onCancelEdit={hideInsertForm}
            onChange={insert}
          />
        ) : (
          <button onClick={showInsertForm} type="button">
            + New
          </button>
        )}
      </li>
    </ul>
  )
}

export default CompletionList
