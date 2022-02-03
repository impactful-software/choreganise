import './Title.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Title () {
  return (
    <section className="titlePage">
      <div className="titleIcon">
        <FontAwesomeIcon className="logoPicture" icon='broom' />
        <p className ="titleText">
          Choreganise
        </p>
      </div>
      <p>
        How much time do you have?
      </p>
    </section>
  )
}
