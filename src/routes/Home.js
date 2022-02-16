import './Home.css'
import { useSelector } from 'react-redux'
import ActiveTask from '../components/ActiveTask.js'
import Title from '../components/Title.js'

function Home () {
  const timerStarted = useSelector(state => state.timer.started)

  return timerStarted ? <ActiveTask /> : <Title />
}

export default Home
