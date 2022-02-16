import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import settingsSlice from './settingsSlice.js'
import taskListSlice from './taskListSlice.js'
import timerSlice from './timerSlice.js'

export const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    let middleware = getDefaultMiddleware()
    if (process.env.NODE_ENV === 'development') {
      middleware = middleware.concat(logger)
    }
    return middleware
  },
  reducer: {
    settings: settingsSlice,
    taskList: taskListSlice,
    timer: timerSlice
  }
})
