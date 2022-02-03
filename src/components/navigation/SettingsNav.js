import './Nav.css'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SettingsNav () {
  return (
    <nav className='nav'>
      <Link to="/">
        <FontAwesomeIcon icon='home' />
      </Link>
    </nav>
  )
}

export default SettingsNav
