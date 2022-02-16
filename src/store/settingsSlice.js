import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import {
  ACTION_STATUS_IDLE,
  ACTION_STATUS_LOADING,
  ACTION_STATUS_REJECTED,
  ACTION_STATUS_SUCCEEDED
} from '../utility/config.js'
import defaultTasks from '../data/defaultTasks.json'
import { encodeTask, resetTasks } from './taskListSlice.js'

const initialState = {
  status: {
    resetDatabase: ACTION_STATUS_IDLE
  }
}

export const resetDatabase = createAsyncThunk('settings/resetDatabase', async ({ db }, {dispatch, getState}) => {
  console.debug('Resetting database.')
  const encodedDefaultTasks = defaultTasks.map(encodeTask)
  console.debug('Encoded default tasks.', encodedDefaultTasks)
  const tasksCollection = db.collection('tasks')
  await tasksCollection.deleteMany({})
  console.debug('Deleted all tasks.')
  await tasksCollection.insertMany(encodedDefaultTasks)
  console.debug('Inserted default tasks.')
  dispatch(resetTasks())
})

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // resetDatabase
      .addCase(resetDatabase.pending, (state, action) => {
        state.status.resetDatabase = ACTION_STATUS_LOADING
      })
      .addCase(resetDatabase.fulfilled, (state, action) => {
        state.status.resetDatabase = ACTION_STATUS_SUCCEEDED
        toast.success('Database reset to default state.')
      })
      .addCase(resetDatabase.rejected, (state, action) => {
        state.status.resetDatabase = ACTION_STATUS_REJECTED
        toast.error('Database reset failed.')
        console.error('Database reset failed.', action.payload)
      })
  }
})

export default settingsSlice.reducer
