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
              key={index}
              onChange={handleChange.bind(this, index)}
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
