import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'

import { devConfig } from './config/firebase.config'

const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
}

firebase.initializeApp(devConfig)

const firebaseAuth = firebase.auth
const ui = new firebaseui.auth.AuthUI(firebaseAuth())

const startFirebaseUI = (elementId: string) => ui.start(elementId, uiConfig)

export { firebaseAuth, startFirebaseUI }
