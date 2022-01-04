import './App.css'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import React from 'react'
import Edit from './routes/Edit'
import Home from './routes/Home'
import View from './routes/View'
import Next from './routes/Next'
import TaskList from './models/TaskList'
import tasks from './data/tasks.json'

function App () {
  const taskList = new TaskList(tasks)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:taskId" element={<Edit taskList={taskList} />} />
          <Route path="/edit" element={<Edit taskList={taskList} />} />
          <Route path="/view" element={<View taskList={taskList} />} />
          <Route path="/next" element={<Next taskList={taskList} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App
