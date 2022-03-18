import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"

function TaskNav () {
  return (
    <nav className='nav'>
      <div className="navIconWrap">
        <Link to="/">
          <FontAwesomeIcon icon='stopwatch' />
        </Link>
      </div>

      <div className="navIconWrap">
        <Link to="/list">
          <FontAwesomeIcon icon='times' />
        </Link>
      </div>
    </nav>
  )
}

export default TaskNav
