import * as React from 'react'
import { firebaseAuth, startFirebaseUI } from '../firebase'

class Login extends React.Component {
  componentDidMount() {
    startFirebaseUI('#firebaseui')
  }

  render() {
    console.log('App.render()')
    return (
      <section id="loginRequired">
        <div id="firebaseui" />
      </section>
    )
  }
}

export default Login
