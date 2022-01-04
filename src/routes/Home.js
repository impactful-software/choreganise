import './Home.css'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBroom, faPlay, faThList } from '@fortawesome/free-solid-svg-icons'

function Home() {
  return (
    <div className="next">
      <nav className="homeLinks"> 
        <Link to="/view" className="viewTasks">
          <FontAwesomeIcon className="taskListPicture" icon={faThList} />
        </Link> 
      </nav>
      <div className="page">
        <section className="titleIcon">
          <FontAwesomeIcon className="logoPicture" icon={faBroom} />
          <p className ="titleText">
            Choreganise
          </p>
        </section>
        <section className="bottomHalf">
          <p>
            How much time do you have?
          </p>
          <form action="/next" className="timerForm">
            <section className="inputTimer">
              <input className="hoursMins" type="text" placeholder="--" name="hours" />
              <span>h</span>
              <input className="hoursMins" type="text" placeholder="--" name="minutes" />
              <span>m</span>
            </section>
            <hr />
            <button className="playButton" type="submit">
              <FontAwesomeIcon className="play" icon={faPlay} />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Home