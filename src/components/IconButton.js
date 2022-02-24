import "./IconButton.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const IconButton = (props) =>{
  const { icon, type = 'button', ...buttonProps } = props

  return (
    <button {...buttonProps} type={type} className='iconButton'>
      <FontAwesomeIcon className="icon" icon={icon} />
    </button>
  )
}

export default IconButton
