import './Next.css'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faHome, faEdit, faCheckCircle, faBed, faHourglassStart, faFastForward, faStop } from '@fortawesome/free-solid-svg-icons'

function Next () {
  return (
    <div className="next">
      <nav className="nextLinks"> 
        <Link to="/" className="homeLink">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Link to="/next" className="alreadyDoneButton">
          <FontAwesomeIcon icon={faCheckCircle} />
        </Link> 
        <Link to="/edit" className="editTaskLink">
          <FontAwesomeIcon icon={faEdit} />
        </Link>
      </nav>
      <section className="page">
        <section className="locationAndDuration">
          <div className="taskLocation">
            <FontAwesomeIcon icon={faHourglassStart} />  0:25:00
          </div>
          <div className="taskLocation">
            Bedroom 
          </div>
        </section>
        <section className="taskNameAndIcon">
          <div className="taskIcon">
            <FontAwesomeIcon icon={faBed} />
          </div>
          <div className="taskName">
            Change Bedding
          </div>
        </section>
        <section className="bottomHalf">
          <form action="/next" className="timerForm">
            <section className="inputTimer">
              <input className="hoursMins" type="text" placeholder="--" name="hours" />
              <span>h</span>
              <input className="hoursMins" type="text" placeholder="--" name="minutes" />
              <span>m</span>
            </section>
            <hr />
            <section className="controls">
              <button className="stopButton" type="submit">
                <FontAwesomeIcon className="play" icon={faStop} />
              </button>
              <button className="playButton" type="submit">
                <FontAwesomeIcon className="play" icon={faPlay} />
              </button>
              <button className="forwardButton" type="submit">
                <FontAwesomeIcon className="play" icon={faFastForward} />
              </button>
            </section>
          </form>
        </section>
      </section>
    </div>
  )
}

export default Next