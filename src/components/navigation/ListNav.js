import './Nav.css'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
