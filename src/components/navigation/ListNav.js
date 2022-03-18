import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom"
import Filter from '../Filter'

function ListNav () {
  return (
    <nav className='nav'>
      <div className="navIconWrap">
        <Link to="/">
          <FontAwesomeIcon icon='stopwatch' />
        </Link>
      </div>

      <div className="navFilterWrap">
        <Filter />
      </div>

      <div className="navIconWrap">
        <Link to="/task">
          <FontAwesomeIcon icon='plus-circle' />
        </Link>
      </div>
    </nav>
  )
}

export default ListNav
