/**
 * App navigation
 */

import * as React from 'react'
import { NavLink } from 'react-router-dom'

enum UrlPath {
  home = '/',
  reports = '/reports',
  member = '/member',
  membersList = '/membersList',
  progParticipants = '/programParticipants',
}

class Nav extends React.Component<{ loggedIn: boolean; logout: React.MouseEventHandler }, {}> {
  render() {
    console.log('Nav', this.props)
    return this.props.loggedIn ? (
      <nav>
        <NavLink to={UrlPath.home}>🏚</NavLink>
        &nbsp;|&nbsp;
        <NavLink to={UrlPath.progParticipants}>Program</NavLink>
        &nbsp;|&nbsp;
        <NavLink to={UrlPath.reports}>Reports</NavLink>
        &nbsp;|&nbsp;
        <NavLink to={UrlPath.membersList}>Members list</NavLink>
        &nbsp;
        <button onClick={this.props.logout}>Logout</button>
      </nav>
    ) : (
      <nav />
    )
  }
}

export { Nav, UrlPath }
