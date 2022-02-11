import { createSlice } from "@reduxjs/toolkit"
import { getUnixTime } from "date-fns"
import { sum } from "lodash"
import { parseTimeString, sumTimeComponents } from "../utility/dateTimeFunctions"

const initialState = {
  activeTask: null,
  duration: 0,
  paused: true,
  segments: [],
  started: false,
  startTime: null
}

function createTimerSegment(task) {
  return {
    start: getUnixTime(new Date()),
    end: 0,
    task
  }
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    pause: (state, action) => {
      state.paused = true
      if (state.segments.length > 0) {
        state.segments[state.segments.length - 1].end = getUnixTime(new Date())
      }
    },

    resume: (state, action) => {
      state.paused = false
      state.segments.push(createTimerSegment(state.activeTask))
    },

    setDuration: (state, action) => {
      state.duration = +action.payload
    },

    start: (state, action) => {
      state.started = true
      state.startTime = getUnixTime(new Date())
      state.segments = initialState.segments
    },

    startNextTask: (state, action) => {
      // Payload should be the full task list, in priority order
      const nextTask = action.payload.find(
        task => sumTimeComponents(parseTimeString(task.duration)) <= selectTimeRemaining({ timer: state })
      )
      state.activeTask = nextTask
      state.paused = false
      state.segments.push(createTimerSegment(nextTask))
    },

    stop: (state, action) => {
      state.activeTask = initialState.activeTask
      state.duration = initialState.duration
      state.paused = initialState.paused
      state.started = initialState.started
      state.startTime = initialState.startTime
      state.segments = initialState.segments
    }
  }
})

export const { pause, resume, startNextTask, setDuration, start, stop } = timerSlice.actions

export const selectTimeRemaining = (state) => {
  const { duration, segments } = state.timer
  const segmentDurations = segments.map(({ start, end }) => {
    if (end >= start) {
      return end - start
    } else {
      return getUnixTime(new Date()) - start
    }
  })
  const timeUsed = sum(segmentDurations)
  return Math.max(0, duration - timeUsed)
}

export default timerSlice.reducer
