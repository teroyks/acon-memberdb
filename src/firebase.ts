import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseui from 'firebaseui'

import { devConfig, prodConfig } from './config/firebase.config'

const uiConfig = {
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  signInSuccessUrl: '/',
}

firebase.initializeApp(prodConfig)

const auth = firebase.auth
const ui = new firebaseui.auth.AuthUI(auth())
const db = firebase.firestore()

const startUI = (elementId: string) => ui.start(elementId, uiConfig)
const stopUI = () => ui.delete

export { auth, db, startUI, stopUI }
