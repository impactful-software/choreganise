import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"

function SettingsNav () {
  return (
    <nav className='nav'>
      <div className="navIconWrap">
        <Link to="/">
          <FontAwesomeIcon icon='stopwatch' />
        </Link>
      </div>
    </nav>
  )
}

export default SettingsNav
