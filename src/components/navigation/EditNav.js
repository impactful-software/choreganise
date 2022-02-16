import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"

function EditNav () {
  return (
    <nav className='nav'>
      <Link to="/">
        <FontAwesomeIcon icon='stopwatch' />
      </Link>
      <Link to="/view">
        <FontAwesomeIcon icon='times' />
      </Link>
    </nav>
  )
}

export default EditNav
