import './Home.css'
import { useSelector } from 'react-redux'
import Title from '../components/Title'
import ActiveTask from '../components/ActiveTask'

function Home () {
  const timerStarted = useSelector(state => state.timer.started)

  return timerStarted ? <ActiveTask /> : <Title />
}

export default Home
