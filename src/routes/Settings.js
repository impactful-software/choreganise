import './Settings.css'
import { useDispatch, useSelector } from 'react-redux'
import { useRealmApp } from '../components/RealmApp'
import { resetDatabase } from '../store/settingsSlice'
import { ACTION_STATUS_LOADING } from '../utility/config'

function Settings () {
  const { db } = useRealmApp()
  const dispatch = useDispatch()
  const status = useSelector(state => state.settings.status)

  const handleResetDatabaseClick = () => {
    if (status.resetDatabase !== ACTION_STATUS_LOADING) {
      dispatch(resetDatabase({ db }))
    }
  }

  return (
    <div className='settingsPage'>
      <h2>Settings</h2>
      <section>
        <h3 className='dangerTitle'>Danger!</h3>
        <p>
          Pressing buttons below here may cause irrevocable changes to data.
        </p>
        <button className='button dangerButton' type='button' onClick={handleResetDatabaseClick}>
          Reset database
        </button>
      </section>
    </div>
  )
}

export default Settings
