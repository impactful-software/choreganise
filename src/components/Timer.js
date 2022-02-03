import './Timer.css'
import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pause, resume, selectTimerStarted, start } from '../store/timerSlice'
import getTimeRemaining, { getResidualSeconds, getWholeHours, getWholeMinutes } from '../utility/getTimeRemaining'

class Timer extends Component {
  constructor (props) {
    super(props)

    this.handleHoursChange = this.handleHoursChange.bind(this)
    this.handleMinutesChange = this.handleMinutesChange.bind(this)
    this.handleTimerFormSubmit = this.handleTimerFormSubmit.bind(this)
    this.stop = this.stop.bind(this)
    this.tick = this.tick.bind(this)

    this.state = {
      initialHours: 0,
      initialMinutes: 0,
      initialSeconds: 0,
      timeRemaining: 0
    }
  }

  componentDidMount () {
    requestAnimationFrame(this.tick)
  }

  componentWillUnmount () {
    this.stop()
  }

  stop () {
    cancelAnimationFrame(this.frameId)
  }

  tick () {
    const { duration, paused, started, startTime } = this.props

    const timeRemaining = getTimeRemaining({duration, paused, startTime})

    if (started && timeRemaining <= 0) {
      this.stop()
    } else {
      this.setState(
        { timeRemaining },
        () => this.frameId = requestAnimationFrame(this.tick)
      )
    }
  }

  handleTimerFormSubmit (event) {
    event.preventDefault()

    const { duration, paused, started, startTime } = this.props

    if (started) {
      if (paused) {
        // Unpause the timer.
        this.props.resume()
      } else {
        // Calculate remaining time components, then pause the timer.
        const timeRemaining = getTimeRemaining({ duration, paused, startTime })
        const initialHours = getWholeHours(timeRemaining)
        const initialMinutes = getWholeMinutes(timeRemaining)
        const initialSeconds = getResidualSeconds(timeRemaining)

        this.setState({ initialHours, initialMinutes, initialSeconds })

        this.props.pause()
      }
    } else {
      // Get timer duration from form, then start the timer.
      const formData = new FormData(event.target)
      const minutes = +formData.get('minutes')
      const hours = +formData.get('hours')
      const seconds = this.state.initialSeconds
      const duration = minutes * 60 + hours * 3600 + seconds

      this.props.start(duration)
    }
  }

  handleHoursChange (event) {
    this.setState({
      initialHours: event.target.value,
      initialSeconds: 0
    })
  }

  handleMinutesChange (event) {
    this.setState({
      initialMinutes: event.target.value,
      initialSeconds: 0
    })
  }

  render () {
    const initialHours = this.state.initialHours
    const initialMinutes = this.state.initialMinutes
    const paused = this.props.paused
    const timeRemaining = this.state.timeRemaining
    const started = this.props.started
    const hours = Math.floor(timeRemaining / 3600)
    const minutes = Math.floor(timeRemaining / 60) % 60 // Modulo 60 removes whole hours
    const seconds = timeRemaining % 60 // Modulo 60 removes whole minutes

    return (
      <form className="timer" onSubmit={this.handleTimerFormSubmit}>
        <section className="time">
          <input
            className="timePart timePartInput"
            disabled={started}
            onChange={this.handleHoursChange}
            name="hours"
            placeholder="--"
            value={started ? hours : initialHours || ''}
            type="text"
          />
          <span>h</span>
          <input
            className="timePart timePartInput"
            disabled={started}
            onChange={this.handleMinutesChange}
            name="minutes"
            placeholder="--"
            value={started ? minutes : initialMinutes || ''}
            type="text"
          />
          <span>m</span>
          {started && (
            <Fragment>
              <span className="timePart">
                {seconds}
              </span>
              <span>s</span>
            </Fragment>
          )}
        </section>

        <hr />

        <section className="controls">
          <button className="control secondaryControl" type="button">
            <FontAwesomeIcon icon='stop' />
          </button>
          <button className="control primaryControl" type="submit">
            <FontAwesomeIcon icon={paused ? 'play' : 'pause'} />
          </button>
          <button className="control secondaryControl" type="button">
            <FontAwesomeIcon icon='fast-forward' />
          </button>
        </section>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  duration: state.timer.duration,
  paused: state.timer.paused,
  started: selectTimerStarted(state),
  startTime: state.timer.startTime,
  timer: state.timer
})

const mapDispatchToProps = {
  pause: () => pause(),
  resume: () => resume(),
  start: (duration) => start(duration)
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
