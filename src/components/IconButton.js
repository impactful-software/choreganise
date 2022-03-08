import "./IconButton.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const IconButton = ({ className, icon, dark = false, type = 'button', ...buttonProps }) => {
  const classes = ['iconButton']

  if (className) {
    classes.push(className)
  }

  return (
    <button {...buttonProps} type={type} className={classes.join(' ')}>
      <FontAwesomeIcon className="icon" icon={icon} />
    </button>
  )
}

export default IconButton
