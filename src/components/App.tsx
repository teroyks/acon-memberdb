import * as React from 'react'
import { BrowserRouter, NavLink, Redirect, Route } from 'react-router-dom'
import { Role, UserData } from '../common/user'
import * as firebase from '../firebase'
import { fetchUser } from '../firestore'
import BadgeList from './BadgeList'
import MemberForm from './MemberEditor'
import MembersList from './MembersList'
import MembersToCheck from './MembersToCheck'
import ProgramParticipants from './ProgramParticipants'
import RegistrationList from './RegistrationList'
import { AuthRoute } from './route-helper'
import { Nav, UrlPath } from './SiteNav'

// default state value when not logged in
const noUser: UserData = {
  name: null,
  roles: [],
  uid: null,
}

type AppState = {
  loadingUser: boolean
  loggedIn: boolean
  user: UserData
}

class App extends React.Component<any, AppState> {
  // should the browser be redirected to the main URL
  private logoutRedirect = false

  constructor(props) {
    super(props)
    this.state = {
      loadingUser: false,
      loggedIn: false,
      user: noUser,
    }
  }

  componentDidMount() {
    console.log('Hello from App!')
    const auth = firebase.auth()
    auth.onAuthStateChanged(async user => {
      this.setState({ loadingUser: true })
      if (user) {
        this.setState({ loggedIn: true })
        console.log('logged-in user: ', user.uid)
        const queryResult = await fetchUser(user.uid)
        if (queryResult.valid) {
          console.log('current user:', queryResult.user)
          this.setState({ user: queryResult.user })
        } else {
          // Logged in user not found in db
          this.setState({ loggedIn: false })
          console.error('Invalid user')
        }
      } else {
        this.setState({ loggedIn: false, user: noUser })
      }
      this.setState({ loadingUser: false })
    })
  }

  componentWillUnmount() {
    firebase.stopUI()
  }

  isLoggedIn = () => this.state.loggedIn
  isLoadingUser = () => this.state.loadingUser

  logout = async () => {
    console.log('Logging out')
    const auth = firebase.auth()
    await auth.signOut()
    if (this) this.logoutRedirect = true // redirect browser to main URL
  }

  render(): JSX.Element {
    if (this.logoutRedirect) {
      this.logoutRedirect = false
      return <Redirect to='/' />
    }

    const { user } = this.state
    return (
      <BrowserRouter>
        <React.Fragment>
          <header>
            <div title='Åcon Member DB'>ÅMDB</div>
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
              path={UrlPath.progParticipants}
              auth={user.roles.includes(Role.user)}
              component={ProgramParticipants}
            />
            <AuthRoute
              exact
              path={UrlPath.membersList}
              auth={user.roles.includes(Role.user)}
              component={MembersList}
            />
            <AuthRoute
              exact
              path={UrlPath.member}
              auth={user.roles.includes(Role.editor)}
              component={MemberForm}
            />
            <AuthRoute
              exact
              path={UrlPath.home}
              auth={user.roles.includes(Role.editor)}
              component={MemberSearchForm}
            />
            <AuthRoute
              exact
              path={UrlPath.home}
              auth={user.roles.includes(Role.editor)}
              component={MembersToCheck}
            />

            <AuthRoute
              exact
              path={UrlPath.badgeReport}
              auth={user.roles.includes(Role.user)}
              component={BadgeList}
            />
            <AuthRoute
              exact
              path={UrlPath.registrationReport}
              auth={user.roles.includes(Role.user)}
              component={RegistrationList}
            />

            <Route
              render={() => (
                <NewUserMessage
                  hasUser={!this.isLoadingUser() && this.isLoggedIn()}
                  roles={user.roles}
                />
              )}
            />
            <Route render={() => <LoadingMessage loading={this.isLoadingUser()} />} />
            <Route render={() => <LoginMessage loggedIn={this.isLoggedIn()} />} />
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

const Report: React.FunctionComponent = () => (
  <section>
    <h1>Reports index</h1>
    <ul>
      <li>
        <NavLink to={UrlPath.badgeReport}>Badge data</NavLink>
      </li>
      <li>
        <NavLink to={UrlPath.registrationReport}>Members list for registration</NavLink>
      </li>
    </ul>
  </section>
)

/**
 * Message to show users with no roles assigned to them.
 * @param param0
 */
const NewUserMessage: React.FunctionComponent<{
  hasUser: boolean
  roles: Role[]
}> = ({ hasUser, roles }) =>
  hasUser && roles.length === 0 ? (
    <p>Welcome! Login successful – ask the administrator to add some permissions for you.</p>
  ) : null

const LoadingMessage: React.FunctionComponent<{ loading: boolean }> = ({ loading }) =>
  loading ? <div>Loading…</div> : null

const LoginMessage: React.FunctionComponent<{ loggedIn: boolean }> = ({ loggedIn }) =>
  loggedIn ? null : (
    <div>
      <a href='/login'>Log in</a> to use the app
    </div>
  )
