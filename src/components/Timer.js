import './Timer.css'
import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pause, selectTimerStarted, setDuration, start, stop } from '../store/timerSlice'
import getTimeRemaining, { getResidualSeconds, getWholeHours, getWholeMinutes, sumTimeComponents } from '../utility/getTimeRemaining'
import getTimeInSeconds from '../utility/getTimeInSeconds'
import { isEqual } from 'lodash'

class Timer extends Component {
  constructor (props) {
    super(props)

    this.handleHoursChange = this.handleHoursChange.bind(this)
    this.handleMinutesChange = this.handleMinutesChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.stop = this.stop.bind(this)
    this.tick = this.tick.bind(this)

    this.state = {
      currentTickTime: getTimeInSeconds(new Date())
    }
  }

  componentDidMount () {
    this.frameId = requestAnimationFrame(this.tick)
  }

  componentWillUnmount () {
    this.stop()
    cancelAnimationFrame(this.frameId)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsModified = !isEqual(nextProps, this.props)
    const stateModified = !isEqual(nextState, this.state)
    return propsModified || stateModified
  }

  stop () {
    this.props.stop()
  }

  tick () {
    const { duration, started, startTime } = this.props

    const currentTickTime = getTimeInSeconds(new Date())

    if (started && currentTickTime >= startTime + duration) {
      this.stop()
      this.frameId = requestAnimationFrame(this.tick)
    } else if (currentTickTime !== startTime) {
      this.setState(
        { currentTickTime },
        () => this.frameId = requestAnimationFrame(this.tick)
      )
    } else {
      this.frameId = requestAnimationFrame(this.tick)
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    const { paused } = this.props

    if (paused) {
      this.props.start()
    } else {
      this.props.pause()
    }
  }

  handleHoursChange (event) {
    const duration = sumTimeComponents({
      hours: +event.target.value || 0,
      minutes: getWholeMinutes(this.props.duration),
      seconds: 0
    })
    this.props.setDuration(duration)
  }

  handleMinutesChange (event) {
    const duration = sumTimeComponents({
      hours: getWholeHours(this.props.duration),
      minutes: +event.target.value || 0,
      seconds: 0
    })
    this.props.setDuration(duration)
  }

  render () {
    const { duration, paused, started, startTime } = this.props
    const initialHours = getWholeHours(duration)
    const initialMinutes = getWholeMinutes(duration)
    const timeRemaining = getTimeRemaining({ duration, paused, startTime })
    const hours = getWholeHours(timeRemaining)
    const minutes = getWholeMinutes(timeRemaining)
    const seconds = getResidualSeconds(timeRemaining)

    return (
      <form className="timer" onSubmit={this.handleSubmit}>
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
          <button className="control secondaryControl" onClick={this.stop} type="button">
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
  initialHours: getWholeHours(state.timer.duration),
  initialMinutes: getWholeMinutes(state.timer.duration),
  initialSeconds: getResidualSeconds(state.timer.duration),
  paused: state.timer.paused,
  started: selectTimerStarted(state),
  startTime: state.timer.startTime
})

const mapDispatchToProps = {
  pause: () => pause(),
  setDuration: (duration) => setDuration(duration),
  start: (duration) => start(duration),
  stop: () => stop()
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
