import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import {
  ACTION_STATUS_IDLE,
  ACTION_STATUS_LOADING,
  ACTION_STATUS_REJECTED,
  ACTION_STATUS_SUCCEEDED
} from '../utility/config'
import defaultTasks from '../data/defaultTasks.json'
import { resetTasks } from './taskListSlice'

const initialState = {
  status: {
    resetDatabase: ACTION_STATUS_IDLE
  }
}

export const resetDatabase = createAsyncThunk('settings/resetDatabase', async ({ db }, {dispatch, getState}) => {
  console.debug('Resetting database.')
  const tasksCollection = db.collection('tasks')
  await tasksCollection.deleteMany({})
  console.debug('Deleted all tasks.')
  await tasksCollection.insertMany(defaultTasks)
  console.debug('Inserted default tasks.')
  dispatch(resetTasks())
})

export const settomgsSlice = createSlice({
  name: 'settomgs',
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

export default settomgsSlice.reducer
