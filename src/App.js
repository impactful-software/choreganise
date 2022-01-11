import './App.css'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import React, { useCallback, useEffect, useState } from 'react'
import * as Realm from "realm-web"
import Edit from './routes/Edit'
import Home from './routes/Home'
import View from './routes/View'
import Next from './routes/Next'
import TaskList from './models/TaskList'
import Timer from './models/Timer'

const REALM_APP_ID = 'choreganise-production-tqrpe'
const realmApp = new Realm.App({ id: REALM_APP_ID })

function App () {
  const [loading, setLoading] = useState(false)
  const [taskList, setTaskList] = useState()
  const [timer, setTimer] = useState()
  const [timeRemaining, setTimeRemaining] = useState('00:00:00')
  const [timerIsPaused, setTimerIsPaused] = useState(false)
  const [user, setUser] = useState(realmApp.currentUser)


  useEffect(() => {
    async function authenticateSession() {
      setLoading(true)

      console.debug('Authenticating session.')

      setUser(await realmApp.logIn(Realm.Credentials.anonymous()))

      console.debug('Authenticated.')
    }

    if (!user && !loading) {
      authenticateSession()
    }
  })

  useEffect(() => {
    async function initialiseTaskList() {
      setLoading(true)

      console.debug('Initialising task list.')

      const mongo = realmApp.currentUser.mongoClient("mongodb-atlas")
      const db = mongo.db('production')
      setTaskList(new TaskList(db))

      console.debug('Task list initialised.')

      setLoading(false)
    }

    if (user && !taskList) {
      initialiseTaskList()
    }
  })

  useEffect(() => {
    console.debug('Creating timer.')
    setTimer(new Timer())
  }, [])

  const startTimer = useCallback(
    (duration) => {
      timer.start(
        duration,
        () => setTimeRemaining(timer.render())
      )
    },
    [timer]
  )

  const stopTimer = useCallback(
    () => {
      timer.stop()
      setTimerIsPaused(true)
      setTimeRemaining(timer.render())
    },
    [timer]
  )

  const toggleTimerPause = useCallback(
    () => {
      if (timer.timeRemaining > 0) {
        if (timer.timerIsPaused) {
          timer.resume()
          setTimerIsPaused(false)
        } else {
          timer.pause()
          setTimerIsPaused(true)
        }
      }
    },
    [timer]
  )

  return (
    <div className="App">
      {loading ? (
        <p>Loading.</p>
      ) : !user ? (
        <p>Failed to authenticate session.</p>
      ) : !taskList ? (
        <p>Failed to fetch task list.</p>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit/:taskId" element={<Edit taskList={taskList} />} />
            <Route path="/edit" element={<Edit taskList={taskList} />} />
            <Route path="/view" element={<View taskList={taskList} />} />
            <Route path="/next" element={<Next timerIsPaused={timerIsPaused} timeRemaining={timeRemaining} startTimer={startTimer} stopTimer={stopTimer} toggleTimerPause={toggleTimerPause} taskList={taskList} />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
