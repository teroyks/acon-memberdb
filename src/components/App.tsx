import * as React from 'react'
import { BrowserRouter, Redirect } from 'react-router-dom'

import * as firebase from '../firebase'

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
import { AuthRoute } from './route-helper'
import { Nav, UrlPath } from './SiteNav'

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
    const auth = firebase.auth()
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
    firebase.stopUI()
  }

  isLoggedIn = () => this.state.user.uid !== null

  logout = () => {
    console.log('Logging out')
    const auth = firebase.auth()
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
            <AuthRoute
              exact
              path={UrlPath.reports}
              auth={user.roles.includes(Role.user)}
              component={Report}
            />
            <AuthRoute
              exact
              path={UrlPath.membersList}
              auth={user.roles.includes(Role.user)}
              component={MembersList}
            />
            <AuthRoute
              exact
              path={UrlPath.home}
              auth={user.roles.includes(Role.editor)}
              component={MemberSearchForm}
            />
          </main>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App

class MemberSearchForm extends React.Component {
  render() {
    return <section>Member search form</section>
  }
}

class Report extends React.Component {
  render() {
    return <div>Reports index</div>
  }
}

class MembersList extends React.Component {
  render() {
    return <div>Members list</div>
  }
}
