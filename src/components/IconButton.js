import "./IconButton.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const IconButton = ({ icon, dark = false, type = 'button', ...buttonProps }) => {
  const classNames = 'iconButton' + (dark ? ' dark' : '')
  return (
    <button {...buttonProps} type={type} className={classNames}>
      <FontAwesomeIcon className="icon" icon={icon} />
    </button>
  )
}

export default IconButton
