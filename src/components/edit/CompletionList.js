import './CompletionList.css'
import Completion from './Completion'
import { useState } from 'react'
import { getUnixTime } from 'date-fns'
import IconButton from '../IconButton'

const CompletionList = ({ completions, onChange }) => {
  const [inserting, setInserting] = useState(false)

  const handleChange = (index, completion) => {
    const modifiedCompletions = [...completions]
    modifiedCompletions[index] = completion
    onChange(modifiedCompletions)
  }

  const handleDelete = (index) => {
    const modifiedCompletions = [...completions.slice(0, index), ...completions.slice(index + 1)]
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
    <table className="completionList">
      <tbody>
        {completions.map((completion, index) => (
            <Completion
              completion={completion}
              key={`${completion.time}_${completion.duration}_${index}`}
              onChange={handleChange.bind(this, index)}
              onDelete={handleDelete.bind(this, index)}
            />
        ))}
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
          <tr className="completionListItem new">
            <td className="tableCell"></td>
            <td className="tableCell"></td>
            <td className="tableCell newButtonWrap">
              <IconButton icon='circle-plus' onClick={showInsertForm} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default CompletionList
