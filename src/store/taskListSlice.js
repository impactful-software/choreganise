import { BSON } from 'realm-web'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  ACTION_STATUS_IDLE,
  ACTION_STATUS_LOADING,
  ACTION_STATUS_REJECTED,
  ACTION_STATUS_SUCCEEDED
} from '../utility/config'
import sortTasksByPriority from '../utility/sortTasksByPriority'

export const defaultTask = {
  _id: '',
  dateCompleted: '',
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
    fetchTasks: ACTION_STATUS_IDLE
  },
  tasks: []
}

function normalizeTask (task) {
  return {
    ...task,
    _id: task._id.toString()
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
  return sortTasksByPriority(tasks.map(normalizeTask))
})

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async ({ db, id }, { dispatch, getState }) => {
  console.debug('Fetching task by ID.', { id })
  const tasksCollection = db.collection('tasks')
  const task = await tasksCollection.findOne({ _id: BSON.ObjectID(id) })
  return normalizeTask(task)
})

export const updateTaskById = createAsyncThunk('tasks/updateTaskById', async ({ db, props }, { dispatch, getState }) => {
  console.debug('Updating task.', { props })
  if (!props._id) {
    throw Error('ID missing from request to update task.')
  }
  const _id = props._id = BSON.ObjectID(props._id)
  const tasksCollection = db.collection('tasks')
  return await tasksCollection.updateOne({ _id }, props)
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
  }
})

export const { resetTasks } = taskListSlice.actions

export default taskListSlice.reducer
