import * as React from 'react'
import * as firebase from '../firebase'

class Login extends React.Component {
  componentDidMount() {
    firebase.startUI('#firebaseui')
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
