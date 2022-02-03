import './Nav.css'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ListNav () {
  return (
    <nav className='nav'>
      <Link to="/" className="homeLink">
        <FontAwesomeIcon icon='home' />
      </Link>
      <Link to="/edit" className="addTaskLink">
        <FontAwesomeIcon icon='plus-circle' />
      </Link>
    </nav>
  )
}

export default ListNav
