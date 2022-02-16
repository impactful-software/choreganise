import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"

function ListNav () {
  return (
    <nav className='nav'>
      <Link to="/">
        <FontAwesomeIcon icon='stopwatch' />
      </Link>
      <Link to="/edit">
        <FontAwesomeIcon icon='plus-circle' />
      </Link>
    </nav>
  )
}

export default ListNav
