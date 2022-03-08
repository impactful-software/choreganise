import { ACTION_STATUS_LOADING } from '../utility/config.js'
import Container from '../components/Container'
import { useDispatch, useSelector } from 'react-redux'
import { useRealmApp } from '../components/RealmApp.js'
import { resetDatabase } from '../store/settingsSlice.js'
import { Button } from '../components/Form'
import Theme from '../components/Theme'
import Section from '../components/Section'

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
    <Container>
      <Section>
        <h2>Settings</h2>
        <Theme danger>
          <Container solid>
            <h3>Danger!</h3>
            <p>
              These settings cause irrevocable changes to data.
            </p>
            <Button type='button' onClick={handleResetDatabaseClick}>
              Reset database
            </Button>
          </Container>
        </Theme>
      </Section>
    </Container>
  )
}

export default Settings
