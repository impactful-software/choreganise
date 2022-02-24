import "./IconButton.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const IconButton = (props) =>{
  const { icon, ...buttonProps } = props

  return (
    <button {...buttonProps} className='iconButton'>
      <FontAwesomeIcon className="icon" icon={icon} />
    </button>
  )
}

export default IconButton
