import './Home.css'
import { useSelector } from 'react-redux'
import { selectTimerStarted } from '../store/timerSlice'
import Title from '../components/Title'
import ActiveTask from '../components/ActiveTask'

function Home () {
  const timerStarted = useSelector(selectTimerStarted)

  return timerStarted ? <ActiveTask /> : <Title />
}

export default Home
