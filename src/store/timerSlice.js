import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUnixTime } from "date-fns"
import { sum } from "lodash"
import { createTaskCompletion, normalizeTask, updateTask } from "./taskListSlice.js"
import { parseTimeString, sumTimeComponents } from "../utility/dateTimeFunctions.js"

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
    end: null,
    task
  }
}

export const completeActiveTask = createAsyncThunk(
  'tasks/completeActiveTask',
  async ({ db }, { dispatch, getState }) => {
    console.debug('Completing active task.')
    const state = getState()
    const activeTask = normalizeTask(state.timer.activeTask)

    const duration = selectTimeSpentOnCurrentTask(state)
    const completion = createTaskCompletion({ duration })

    activeTask.completions.push(completion)

    dispatch(updateTask({ db, props: activeTask }))

    return activeTask
  }
)

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
        task => sumTimeComponents(parseTimeString(task.duration || '00:00')) <= selectTimeRemaining({ timer: state })
      )
      state.activeTask = typeof nextTask !== 'undefined' ? nextTask : initialState.activeTask
      state.paused = false
      if (state.segments.length > 0) {
        state.segments[state.segments.length - 1].end = getUnixTime(new Date())
      }
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

export const selectTimeSpentOnCurrentTask = (state) => {
  const { activeTask, segments } = state.timer
  return sum(
    segments
      .filter(segment => segment.task._id === activeTask._id)
      .map(segment => {
        if (segment.end >= segment.start) {
          return segment.end - segment.start
        } else {
          return getUnixTime(new Date()) - segment.start
        }
      })
  )
}

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
