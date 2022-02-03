import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import settingsSlice from './settingsSlice'
import taskListSlice from './taskListSlice'
import timerSlice from './timerSlice'

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
