import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"

function HomeNav () {
  return (
    <nav className='nav'>
      <Link to="/settings">
        <FontAwesomeIcon icon='cog' />
      </Link>
      <Link to="/view">
        <FontAwesomeIcon icon='th-list' />
      </Link>
    </nav>
  )
}

export default HomeNav
