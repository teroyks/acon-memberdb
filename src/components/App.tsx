import * as React from 'react'
import { BrowserRouter, NavLink, Redirect } from 'react-router-dom'

import { firebaseAuth, stopFirebaseUI } from '../firebase'
import { AuthRouteWithProps } from './route-helper'

enum Role {
  admin = 'Administrator',
  user = 'User',
}

type UserData = {
  readonly uid: string
  readonly name: string
  readonly roles: Role[]
}
type UserList = {
  readonly [uid: string]: UserData
}

const noUser: UserData = {
  uid: null,
  name: null,
  roles: [],
}

const users: UserList = {
  adminuser: {
    uid: 'foo',
    name: 'Foo',
    roles: [Role.admin, Role.user],
  },
  user: {
    uid: 'bar',
    name: 'Bar',
    roles: [Role.user],
  },
  admin: {
    uid: 'boo',
    name: 'I am an admin',
    roles: [Role.admin],
  },
  none: {
    uid: 'none',
    name: 'Baz',
    roles: [],
  },
}

const AuthUser = ({ name }) => {
  console.log('AuthUser', name)
  return <div>AuthUser {name}</div>
}

const notLoggedInMessage = () => <a href="/login">Log in</a>

class Nav extends React.Component<{ loggedIn: boolean; logout: React.MouseEventHandler }, {}> {
  render() {
    console.log('Nav', this.props)
    return this.props.loggedIn ? (
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/main">Main</NavLink>
        <NavLink to="/auth">Auth</NavLink>
        <NavLink to="/user">User</NavLink>
        <NavLink to="/component">Auth-component</NavLink>
        <button onClick={this.props.logout}>Logout</button>
      </nav>
    ) : (
      <nav>{notLoggedInMessage()}</nav>
    )
  }
}

type AppState = {
  user: UserData
}

class App extends React.Component<any, AppState> {
  // should the browser be redirected to the main URL
  private logoutRedirect = false

  constructor(props) {
    super(props)
    this.state = {
      user: noUser,
    }
  }

  componentDidMount() {
    console.log('Hello from App!')
    const auth = firebaseAuth()
    auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUser: UserData = {
          uid: user.uid,
          name: user.displayName,
          roles: [Role.user, Role.admin],
        }
        this.setState({ user: currentUser })
      } else {
        this.setState({ user: noUser })
      }
    })
  }

  componentWillUnmount() {
    stopFirebaseUI()
  }

  isLoggedIn = () => this.state.user.uid !== null

  logout = () => {
    console.log('Logging out')
    const auth = firebaseAuth()
    auth.signOut()
    if (this) this.logoutRedirect = true // redirect browser to main URL
  }

  render() {
    if (this.logoutRedirect) {
      this.logoutRedirect = false
      return <Redirect to="/" />
    }

    const { user } = this.state
    return (
      <BrowserRouter>
        <React.Fragment>
          <header>
            <div title="Åcon Member DB">ÅMDB</div>
            <Nav loggedIn={this.isLoggedIn()} logout={this.logout} />
          </header>
          <main>
            <AuthRouteWithProps
              exact
              path="/component"
              auth={user.roles.includes(Role.user)}
              component={AuthUser}
              componentProps={{ foo: 'foo', name: user.name }}
            />
            <AuthRouteWithProps
              exact
              path="/component"
              auth={user.roles.includes(Role.admin)}
              component={AuthUser}
              componentProps={{ admin: 'yes', name: 'A. Admin' }}
            />
          </main>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App
