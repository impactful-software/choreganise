import { createSlice } from "@reduxjs/toolkit"
import { getUnixTime } from "date-fns"
import getTimeRemaining from "../utility/dateTimeFunctions"

const initialState = {
  duration: 0,
  paused: true,
  started: false,
  startTime: null
}

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    pause: (state, action) => {
      const { duration, startTime } = state
      state.duration = getTimeRemaining({ duration, startTime })
      state.paused = true
      state.startTime = initialState.startTime
    },

    setDuration: (state, action) => {
      state.duration = +action.payload
    },

    start: (state, action) => {
      state.paused = false
      state.started = true
      state.startTime = getUnixTime(new Date())
    },

    stop: (state, action) => {
      state.duration = initialState.duration
      state.paused = initialState.paused
      state.started = initialState.started
      state.startTime = initialState.startTime
    }
  }
})

export const { pause, setDuration, start, stop } = timerSlice.actions

export default timerSlice.reducer
