import './App.css'
import './fontAwesomeIcons.js'

import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

import Edit from './routes/Edit.js'
import EditNav from './components/navigation/EditNav.js'
import Home from './routes/Home.js'
import HomeNav from './components/navigation/HomeNav.js'
import ListNav from './components/navigation/ListNav.js'
import Settings from './routes/Settings.js'
import SettingsNav from './components/navigation/SettingsNav.js'
import Theme from './components/Theme'
import Timer from './components/Timer.js'
import View from './routes/View.js'

function App () {
  const timerStarted = useSelector(state => state.timer.started)
  const location = useLocation()
  const showTimer = timerStarted || location.pathname === '/'

  return (
    <Theme default>
      <div className="app">
        <Toaster />

        <header className="header">
          <Routes>
            <Route path="/" element={<HomeNav />} />
            <Route path="/edit/:taskId" element={<EditNav />} />
            <Route path="/edit" element={<EditNav />} />
            <Route path="/settings" element={<SettingsNav />} />
            <Route path="/view" element={<ListNav />} />
          </Routes>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit/:taskId" element={<Edit />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/view" element={<View />} />
          </Routes>
        </main>

        {showTimer && (
          <footer className="footer">
            <Theme dark>
              <Timer />
            </Theme>
          </footer>
        )}
      </div>
    </Theme>
  )
}

export default App
