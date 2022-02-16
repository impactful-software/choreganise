import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"

function SettingsNav () {
  return (
    <nav className='nav'>
      <Link to="/">
        <FontAwesomeIcon icon='stopwatch' />
      </Link>
    </nav>
  )
}

export default SettingsNav
