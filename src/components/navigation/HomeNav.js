import './Nav.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Filter from '../Filter'

function HomeNav () {
  return (
    <nav className="nav">
      <div className="navIconWrap">
        <Link to="/settings">
          <FontAwesomeIcon icon="cog" />
        </Link>
      </div>

      <div className="navFilterWrap">
        <Filter />
      </div>

      <div className="navIconWrap">
        <Link to="/list">
          <FontAwesomeIcon icon="th-list" />
        </Link>
      </div>
    </nav>
  )
}

export default HomeNav
