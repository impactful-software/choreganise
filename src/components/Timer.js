import './Timer.css'
import { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { getUnixTime } from 'date-fns'
import { pause, resume, selectTimeRemaining, setDuration, skipActiveTask, start, stop } from '../store/timerSlice.js'
import { getResidualSeconds, getWholeHours, getWholeMinutes, sumTimeComponents } from '../utility/dateTimeFunctions.js'
import IconButton from './IconButton'
import Container from './Container'
import Modal from './Modal'
import { Button } from './Form'
import Theme from './Theme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Timer extends Component {
  constructor (props) {
    super(props)

    this.handleAnimationFrame = this.handleAnimationFrame.bind(this)
    this.handleHoursChange = this.handleHoursChange.bind(this)
    this.handleMinutesChange = this.handleMinutesChange.bind(this)
    this.handleSecondsChange = this.handleSecondsChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.skipActiveTask = this.skipActiveTask.bind(this)
    this.stop = this.stop.bind(this)
    this.togglePause = this.togglePause.bind(this)

    this.state = {
      currentTickTime: getUnixTime(new Date()),
      showStopConfirmation: false,
      showSkipConfirmation: false
    }
  }

  componentDidMount () {
    this.frameId = requestAnimationFrame(this.handleAnimationFrame)
  }

  componentWillUnmount () {
    if (this.props.timer.started) {
      this.props.stop()
    }
    cancelAnimationFrame(this.frameId)
  }

  handleAnimationFrame () {
    const { duration, paused, started, startTime } = this.props.timer

    const now = getUnixTime(new Date())

    if (started && !paused && now > startTime) {
      if (now < startTime + duration) {
        // Timer is running; update tick time
        this.setState(
          { now },
          () => this.frameId = requestAnimationFrame(this.handleAnimationFrame)
        )
      } else {
        // Timer passed end time; pause the timer
        this.props.pause()
        this.frameId = requestAnimationFrame(this.handleAnimationFrame)
      }
    } else {
      // Timer not started, do nothing this frame
      this.frameId = requestAnimationFrame(this.handleAnimationFrame)
    }
  }

  handleSubmit (event) {
    event.preventDefault()

    if (this.props.timer.paused) {
      this.props.start()
    } else {
      this.props.pause()
    }
  }

  handleHoursChange (event) {
    const duration = sumTimeComponents({
      hours: +event.target.value || 0,
      minutes: getWholeMinutes(this.props.timer.duration),
      seconds: 0
    })
    this.props.setDuration(duration)
  }

  handleMinutesChange (event) {
    const duration = sumTimeComponents({
      hours: getWholeHours(this.props.timer.duration),
      minutes: +event.target.value || 0,
      seconds: 0
    })
    this.props.setDuration(duration)
  }

  handleSecondsChange (event) {
    const duration = sumTimeComponents({
      hours: getWholeHours(this.props.timer.duration),
      minutes: getWholeMinutes(this.props.timer.duration),
      seconds: +event.target.value || 0
    })
    this.props.setDuration(duration)
  }

  skipActiveTask () {
    this.props.skipActiveTask()
    this.setState({ showSkipConfirmation: false })
  }

  stop () {
    this.props.stop()
    this.setState({ showStopConfirmation: false })
  }

  togglePause () {
    if (this.props.timer.paused) {
      this.props.resume()
    } else {
      this.props.pause()
    }
  }

  render () {
    const { timer } = this.props
    const { activeTask, duration, paused, started } = timer
    const initialHours = getWholeHours(duration)
    const initialMinutes = getWholeMinutes(duration)
    const timeRemaining = selectTimeRemaining({ timer })
    const hours = getWholeHours(timeRemaining)
    const minutes = getWholeMinutes(timeRemaining)
    const seconds = getResidualSeconds(timeRemaining)

    return (
      <Container>
        <Container solid>
          <form className="timer" onSubmit={this.handleSubmit}>
            <section className="time">
              <input
                className="timerInput"
                disabled={started}
                onChange={this.handleHoursChange}
                name="hours"
                placeholder="--"
                value={started ? hours : initialHours || ""}
                type="text"
              />
              <span>h</span>
              <input
                className="timerInput"
                disabled={started}
                onChange={this.handleMinutesChange}
                name="minutes"
                placeholder="--"
                value={started ? minutes : initialMinutes || ""}
                type="text"
              />
              <span>m</span>
              {started && (
                <Fragment>
                  <span className="timerInput">
                    {seconds}
                  </span>
                  <span>s</span>
                </Fragment>
              )}
            </section>

            <hr />

            <section className="timerControls">
              <IconButton
                className="timerSecondaryControl"
                disabled={!started}
                icon="stop"
                onClick={started ? () => this.setState({ showStopConfirmation: true }) : null}
                type="button"
              />
              <IconButton
                className="timerPrimaryControl"
                disabled={started ? !activeTask : (!initialHours && !initialMinutes)}
                icon={paused ? "play" : "pause"}
                onClick={started ? this.togglePause : null}
                type={started? "button" : "submit"}
              />
              <IconButton
                className="timerSecondaryControl"
                disabled={!activeTask}
                icon="forward-step"
                onClick={started ? () => this.setState({ showSkipConfirmation: true }) : null}
                type="button"
              />
            </section>
          </form>

          {this.state.showSkipConfirmation && (
            <Modal theme="default invert">
              <p>
                Are you sure about that? Skipping tasks seems awfully lazy
              </p>
              <div className="timerModalControls">
                <Theme default>
                  <Button onClick={started ? () => this.setState({ showSkipConfirmation: false }) : null} type="button">
                    Cancel
                  </Button>
                </Theme>

                <Theme danger>
                  <Button onClick={started ? this.skipActiveTask : null} type="button">
                    <FontAwesomeIcon icon="forward" />
                    &nbsp;
                    Skip task
                  </Button>
                </Theme>
              </div>
            </Modal>
          )}

          {this.state.showStopConfirmation && (
            <Modal theme="default invert">
              <p>
                Are you sure you want to stop your chore session early?
              </p>
              <div className="timerModalControls">
                <Theme default>
                  <Button onClick={started ? () => this.setState({ showStopConfirmation: false }) : null} type="button">
                    Cancel
                  </Button>
                </Theme>

                <Theme danger>
                  <Button onClick={started ? this.stop : null} type="button">
                    <FontAwesomeIcon icon="stop" />
                    &nbsp;
                    End session
                  </Button>
                </Theme>
              </div>
            </Modal>
          )}
        </Container>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  timer: state.timer
})

const mapDispatchToProps = {
  pause: () => pause(),
  resume: () => resume(),
  setDuration: (duration) => setDuration(duration),
  skipActiveTask: () => skipActiveTask(),
  start: () => start(),
  stop: () => stop()
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
