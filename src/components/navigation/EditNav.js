import './Nav.css'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
