import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"

function TaskNav () {
  return (
    <nav className='nav'>
      <Link to="/">
        <FontAwesomeIcon icon='stopwatch' />
      </Link>
      <Link to="/list">
        <FontAwesomeIcon icon='times' />
      </Link>
    </nav>
  )
}

export default TaskNav