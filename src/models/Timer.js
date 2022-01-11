class Timer {
  static increment = 1

  constructor () {
    this.interval = null
    this.isPaused = true
    this.timeRemaining = 0
  }

  pause () {
    console.debug('Pausing timer.')
    this.isPaused = true
  }

  render () {
    const timeInSeconds = this.timeRemaining
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor(timeInSeconds / 60) % 60 // Modulo 60 removes whole hours
    const seconds = timeInSeconds % 60 // Modulo 60 removes whole minutes

    return [hours, minutes, seconds]
      .map(part => part.toString().padStart(2, '0'))
      .join(':')
  }

  resume () {
    console.debug('Resuming timer.')
    this.isPaused = false
  }

  setDuration (duration) {
    console.debug(`Setting timer duration to ${duration}.`)
    this.timeRemaining = duration
  }

  start (duration, incrementCallback) {
    if (this.interval) {
      // Replace existing timer
      this.stop()
    }

    if (duration) {
      this.setDuration(duration)
    }

    console.debug(`Starting timer.`)
    this.isPaused = false

    this.interval = setInterval(
      () => {
        if (this.timeRemaining < 1) {
          this.stop()
        }

        if (!this.isPaused) {
          this.timeRemaining -= Timer.increment

          if (incrementCallback) {
            incrementCallback(this.timeRemaining)
          }
        }
      },
      Timer.increment * 1000
    )
  }

  stop () {
    if (this.interval) {
      console.debug('Stopping timer.')
      clearInterval(this.interval)
      this.interval = null
      this.isPaused = true
      this.timeRemaining = 0
    }
  }
}

export default Timer
