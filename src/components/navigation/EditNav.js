import './Nav.css'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function EditNav () {
  return (
    <nav className='nav'>
      <Link to="/" className="homeLink">
        <FontAwesomeIcon icon='home' />
      </Link>
      <Link to="/view" className="alreadyDoneButton">
        <FontAwesomeIcon icon='check-circle' />
      </Link>
    </nav>
  )
}

export default EditNav
