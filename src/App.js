import './App.css'
import './fontAwesomeIcons.js'
import { Route, Routes } from 'react-router-dom'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import Edit from './routes/Edit.js'
import Home from './routes/Home.js'
import View from './routes/View.js'
import Settings from './routes/Settings.js'
import Timer from './components/Timer.js'
import HomeNav from './components/navigation/HomeNav.js'
import EditNav from './components/navigation/EditNav.js'
import ListNav from './components/navigation/ListNav.js'
import SettingsNav from './components/navigation/SettingsNav.js'
import Theme from './components/Theme'

function App () {
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

        <footer className="footer">
          <Theme dark>
            <Timer />
          </Theme>
        </footer>
      </div>
    </Theme>
  )
}

export default App
