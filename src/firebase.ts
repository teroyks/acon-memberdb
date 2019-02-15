import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'

import { devConfig } from './config/firebase.config'

const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
}

firebase.initializeApp(devConfig)

const auth = firebase.auth
const ui = new firebaseui.auth.AuthUI(auth())

const startUI = (elementId: string) => ui.start(elementId, uiConfig)
const stopUI = () => ui.delete

export { auth, startUI, stopUI }
