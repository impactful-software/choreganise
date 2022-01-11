import './Next.css'
import { useEffect } from 'react'
import { Link, useSearchParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faEdit, faCheckCircle, faBed, faHourglassStart, faFastForward, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'

function Next ({ startTimer, stopTimer, timeRemaining, timerIsPaused, toggleTimerPause }) {
  const [searchParams] = useSearchParams()
  const hours = searchParams.get('hours')
  const minutes = searchParams.get('minutes')

  useEffect(() => {
    const durationInSeconds = minutes * 60 + hours * 3600

    startTimer(durationInSeconds)
    return stopTimer
  }, [hours, minutes, startTimer, stopTimer])

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
            <FontAwesomeIcon icon={faHourglassStart} />  {timeRemaining}
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
              <input className="hoursMins" type="text" placeholder="--" name="hours" defaultValue={hours} />
              <span>h</span>
              <input className="hoursMins" type="text" placeholder="--" name="minutes" defaultValue={minutes} />
              <span>m</span>
            </section>
            <hr />
            <section className="controls">
              <button className="stopButton" type="button" onClick={stopTimer}>
                <FontAwesomeIcon className="play" icon={faStop} />
              </button>
              <button className="playButton" type="button" onClick={toggleTimerPause}>
                <FontAwesomeIcon className="play" icon={timerIsPaused ? faPlay : faPause} />
              </button>
              <button className="forwardButton" type="button">
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
