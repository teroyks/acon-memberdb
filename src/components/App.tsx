import * as React from 'react'
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'

import { firebaseAuth } from '../firebase'

enum Role {
  admin = 'Administrator',
  user = 'User',
}

type UserData = {
  readonly uid: string
  readonly name: string
  readonly roles: Role[]
}
interface UserList {
  readonly [uid: string]: UserData
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

// Properties passed to RouteWithProps
interface RouteProps {
  component: any // rendered component
  componentProps?: any // properties passed to the component
  [propName: string]: any // route properties
}
// Properties passed to AuthRoute
interface AuthRouteProps {
  component: any // rendered component
  auth: boolean // tells if the component should be rendered
  [propName: string]: any // route properties
}

/**
 * Pass properties to rendered component
 * @param param0 RouteProps
 */
const RouteWithProps = ({
  component: Component,
  componentProps = {},
  ...routeProps
}: RouteProps) => (
  <Route {...routeProps} render={(props) => <Component {...props} {...componentProps} />} />
)

/**
 * Only render component route if authentication is successful
 * @param param0
 */
const AuthRoute = ({ component: Component, auth, ...rest }: AuthRouteProps) => (
  <Route {...rest} render={(props) => (auth ? <Component {...props} /> : null)} />
)

/**
 * Render component and pass properties if authentication is successful
 * @param param0
 */
const AuthRouteWithProps = ({
  component: Component,
  componentProps,
  auth,
  ...routeProps
}: RouteProps & AuthRouteProps) =>
  auth ? (
    <RouteWithProps component={Component} componentProps={componentProps} {...routeProps} />
  ) : null

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

interface AppState {
  user: UserData
}

class App extends React.Component<any, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
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
        this.setState({ user: null })
      }
    })
  }

  isLoggedIn = () => this.state.user !== null

  logout() {
    const auth = firebaseAuth()
    auth.signOut()
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <header>
            <div title="Åcon Member DB">ÅMDB</div>
            <Nav loggedIn={this.isLoggedIn()} logout={this.logout} />
          </header>
          <main>
            {this.isLoggedIn() ? (
              <div>
                <AuthRouteWithProps
                  exact
                  path="/component"
                  auth={this.state.user.roles.includes(Role.user)}
                  component={AuthUser}
                  componentProps={{ foo: 'foo', name: this.state.user.name }}
                />
                <AuthRouteWithProps
                  exact
                  path="/component"
                  auth={this.state.user.roles.includes(Role.admin)}
                  component={AuthUser}
                  componentProps={{ admin: 'yes', name: 'A. Admin' }}
                />
              </div>
            ) : null}
          </main>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App
