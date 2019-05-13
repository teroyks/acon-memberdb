/**
 * List of members who don't have the full name property
 */

import * as React from 'react'

import * as db from '../firestore'

interface DocItem {
  data: firebase.firestore.DocumentData
  id: string
}

class FullNamesToCheck extends React.Component {
  readonly collRef = db.fetchAllMembers()

  unsubscribe: () => void = undefined // function to stop the snapshot listener

  state: {
    docs: DocItem[]
    errorMsg: string
    fetching: boolean
  } = {
    docs: [],
    errorMsg: undefined,
    fetching: false,
  }

  componentDidMount() {
    this.unsubscribe = this.collRef.onSnapshot(this.onListUpdate, err =>
      this.handleError(err, 'Cannot fetch the members list')
    )
    this.setState({ fetching: true })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleError(err: Error, errorMsg = err.message) {
    console.error(err)
    this.setState({ errorMsg, fetching: false })
  }

  onListUpdate = (snapshot: firebase.firestore.QuerySnapshot) => {
    const docs = snapshot.docs.map(docSnapshot => ({
      data: docSnapshot.data(),
      id: docSnapshot.id,
    }))

    this.setState({
      docs,
      fetching: false,
    })
  }

  render() {
    const { docs, errorMsg, fetching } = this.state
    return (
      <section>
        <h2>Full names to check</h2>
        {fetching ? <p>Loading members…</p> : <MembersList docs={docs} />}
        <ErrorMessage message={errorMsg} />
      </section>
    )
  }
}

const MembersList: React.FunctionComponent<{ docs: DocItem[] }> = ({ docs }) =>
  docs.length ? (
    <table>
      <thead>
        <tr>
          <th>Member ID</th>
          <th>Sort order</th>
        </tr>
      </thead>
      <tbody>
        {docs.map(doc => (
          <MemberLink key={doc.id} member={doc.data as db.MemberData} />
        ))}
      </tbody>
    </table>
  ) : null

const MemberLink: React.FunctionComponent<{ member: db.MemberData }> = ({
  member: { fullName, fullNameSort, memberId },
}) =>
  fullName ? null : (
    <tr>
      <td>{memberId}</td>
      <td>{fullNameSort}</td>
    </tr>
  )

const ErrorMessage: React.FunctionComponent<{ message: string }> = ({ message }) =>
  message ? <div style={{ color: 'red' }}>{message}</div> : null

export default FullNamesToCheck
