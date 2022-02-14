import { BSON } from 'realm-web'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  ACTION_STATUS_IDLE,
  ACTION_STATUS_LOADING,
  ACTION_STATUS_REJECTED,
  ACTION_STATUS_SUCCEEDED
} from '../utility/config'
import sortTasksByPriority from '../utility/sortTasksByPriority'
import { getUnixTime } from 'date-fns'
import { defaultsDeep, findIndex } from 'lodash'

export const defaultTask = {
  completions: [],
  duration: '',
  frequency: 1,
  frequencyUnit: 'days',
  icon: '',
  location: '',
  name: '',
  prioritise: false,
}

const initialState = {
  status: {
    fetchTasks: ACTION_STATUS_IDLE,
    updateTask: ACTION_STATUS_IDLE
  },
  tasks: []
}

export function decodeTask (task) {
  return defaultsDeep(
    normalizeTask(task),
    defaultTask
  )
}

export function encodeTask (task) {
  const normalizedTask = normalizeTask(task)
  const encodedId = task._id ? { _id: BSON.ObjectID(task._id) } : {}
  return defaultsDeep(
    encodedId,
    normalizedTask,
    defaultTask
  )
}

export function normalizeTask (task) {
  const decodedId = task._id ? { _id: task._id.toString() } : {}
  return defaultsDeep(
    decodedId,
    {
      frequencyUnit: task.frequencyUnit ? task.frequencyUnit.toLowerCase() : '',
      icon: task.icon ? task.icon.toLowerCase() : '',
      location: task.location ? task.location.toLowerCase() : '',
      name: task.name ? task.name.toLowerCase() : ''
    },
    task
  )
}

export function createTaskCompletion({ duration, time }) {
  if (Number.isNaN(time) && typeof time !== 'undefined') {
    throw Error(`Cannot create task completion object with invalid time '${time}'.`)
  }
  const date = typeof time === 'undefined' ? new Date() : new Date(time)

  return {
    duration,
    time: getUnixTime(date)
  }
}

export const createTask = createAsyncThunk('tasks/createTask', async ({ db, props }, { dispatch, getState }) => {
  console.debug('Creating task.', { props })
  const tasksCollection = db.collection('tasks')
  return await tasksCollection.insertOne(props)
})

export const deleteTaskById = createAsyncThunk('tasks/deleteTaskById', async ({ db, id }, { dispatch, getState }) => {
  console.debug('Deleting task.', { id })
  const tasksCollection = db.collection('tasks')
  return await tasksCollection.deleteOne({ _id: BSON.ObjectID(id) })
})

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async ({ db, filter }, { dispatch, getState }) => {
  console.debug('Fetching tasks.', { filter })
  const tasksCollection = db.collection('tasks')
  const tasks = await tasksCollection.find(filter)
  return sortTasksByPriority(tasks.map(decodeTask))
})

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async ({ db, id }, { dispatch, getState }) => {
  console.debug('Fetching task by ID.', { id })
  const tasksCollection = db.collection('tasks')
  const task = await tasksCollection.findOne({ _id: BSON.ObjectID(id) })
  return decodeTask(task)
})

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ db, props }, { dispatch, getState }) => {
  console.debug('Updating task.', { props })
  if (!props._id) {
    throw Error('Cannot update task without an `_id` prop.')
  }
  const tasksCollection = db.collection('tasks')
  const result = await tasksCollection.updateOne({ _id: BSON.ObjectID(props._id) }, encodeTask(props))
  if (result.modifiedCount !== 1) {
    throw Error(`Failed to update task by ID. ${result.modifiedCount} rows affected.`)
  }
  return props
})

export const watchTasks = createAsyncThunk('tasks/watchTasks', async ({ db, filter, ids }, { dispatch, getState }) => {
  console.debug('Watching tasks.', { filter, ids })
  const tasksCollection = db.collection('tasks')
  return await tasksCollection.watch(filter, ids)
})

export const taskListSlice = createSlice({
  name: 'taskList',
  initialState,
  reducers: {
    prioritiseTasks: (state, action) => {
      state.tasks = sortTasksByPriority(state.tasks)
    },
    resetTasks: (state, action) => {
      state.status.fetchTasks = initialState.status.fetchTasks
      state.tasks = initialState.tasks
    }
  },
  extraReducers(builder) {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state, action) => {
        state.status.fetchTasks = ACTION_STATUS_LOADING
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status.fetchTasks = ACTION_STATUS_SUCCEEDED
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status.fetchTasks = ACTION_STATUS_REJECTED
      })
      // updateTask
      .addCase(updateTask.pending, (state, action) => {
        state.status.updateTask = ACTION_STATUS_LOADING
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status.updateTask = ACTION_STATUS_SUCCEEDED
        const taskIndex = findIndex(state.tasks, { _id: action.payload._id })
        state.tasks[taskIndex] = action.payload
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status.updateTask = ACTION_STATUS_REJECTED
      })
  }
})

export const { prioritiseTasks, resetTasks } = taskListSlice.actions

export default taskListSlice.reducer
