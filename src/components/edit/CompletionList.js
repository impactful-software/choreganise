import './CompletionList.css'
import Completion from './Completion'

const CompletionList = ({ completions, onChange }) => {
  const handleChange = (index, completion) => {
    const modifiedCompletions = [...completions]
    modifiedCompletions[index] = completion
    onChange(modifiedCompletions)
  }

  return (
    <ul className="completionList">
      {completions.map((completion, index) => (
        <Completion
          completion={completion}
          key={index}
          onChange={handleChange.bind(this, index)}
        />
      ))}
    </ul>
  )
}

export default CompletionList
