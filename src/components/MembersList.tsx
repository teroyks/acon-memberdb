import * as React from 'react'
import { membersListURL } from '../config/app.config'

const fetchData = async () => {
  if (!membersListURL) {
    throw Error('membersListURL not defined in config')
  }
  const res = await fetch(membersListURL)
  return await res.text()
}

class MembersList extends React.Component {
  state = { data: 'loading...' }

  componentDidMount() {
    fetchData()
      .then(data => {
        this.setState({ data })
      })
      .catch(err => {
        console.error(err.message)
        this.setState({ data: 'Failed to retrieve list' })
      })
  }

  render() {
    return (
      <section>
        <h1>Members</h1>
        <pre>{this.state.data}</pre>
      </section>
    )
  }
}

export default MembersList
