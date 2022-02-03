import './App.css'
import './fontAwesomeIcons'
import { Route, Routes } from 'react-router-dom'
import React, { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import Edit from './routes/Edit'
import Home from './routes/Home'
import View from './routes/View'
import Settings from './routes/Settings'
import Timer from './components/Timer'
import HomeNav from './components/navigation/HomeNav'
import EditNav from './components/navigation/EditNav'
import ListNav from './components/navigation/ListNav'
import SettingsNav from './components/navigation/SettingsNav'

function App () {
  return (
    <div className="App">
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
        <Fragment>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit/:taskId" element={<Edit />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/view" element={<View />} />
          </Routes>
        </Fragment>
      </main>

      <footer className="footer">
        <Timer />
      </footer>
    </div>
  )
}

export default App
