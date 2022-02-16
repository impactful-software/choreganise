import * as Realm from "realm-web"
import React, { useContext, useEffect, useState } from "react"
import {
  ACTION_STATUS_IDLE,
  ACTION_STATUS_LOADING,
  ACTION_STATUS_REJECTED,
  ACTION_STATUS_SUCCEEDED,
  REALM_APP_ID,
  REALM_CLIENT_TYPE,
  REALM_DB_NAME
} from "../utility/config.js"

export const RealmAppContext = React.createContext(null)

const app = new Realm.App({ id: REALM_APP_ID })

const RealmApp = ({ children }) => {
  const [db, setDb] = useState(null)
  const [authenticateStatus, setAuthenticateStatus] = useState(ACTION_STATUS_IDLE)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function authenticateSession() {
      console.debug('Authenticating session.')
      setAuthenticateStatus(ACTION_STATUS_LOADING)
      setUser(await app.logIn(Realm.Credentials.anonymous()))
      setAuthenticateStatus(ACTION_STATUS_SUCCEEDED)
      console.debug('Authenticated.')
    }

    if (authenticateStatus === ACTION_STATUS_IDLE) {
      authenticateSession()
    }
  }, [authenticateStatus, setAuthenticateStatus, user])

  useEffect(() => {
    if (user !== null) {
      setDb(user.mongoClient(REALM_CLIENT_TYPE).db(REALM_DB_NAME))
    }
  }, [user])

  const logOut = () => {
    if (user !== null) {
      app.currentUser.logOut()
      setUser(null)
    }
  }

  return authenticateStatus === ACTION_STATUS_IDLE || authenticateStatus === ACTION_STATUS_LOADING ? (
    <p>Authenticating session.</p>
  ) : authenticateStatus === ACTION_STATUS_REJECTED ? (
    <p>Authentication failed.</p>
  ) : (
    <RealmAppContext.Provider
      value={{
        db,
        logOut,
        user,
      }}
    >
      {children}
    </RealmAppContext.Provider>
  )
}

export const useRealmApp = () => {
  const realmContext = useContext(RealmAppContext)
  if (realmContext == null) {
    throw new Error("useRealmApp() called outside of a RealmApp?")
  }
  return realmContext
}

export default RealmApp
