import * as React from 'react'
import { fetchRegistrationList, RegistrationData } from '../firestore'

class RegistrationList extends React.Component {
  state = {
    fetching: true,
    members: [] as RegistrationData[],
  }

  async componentDidMount() {
    const members: RegistrationData[] = await fetchRegistrationList()
    this.setState({
      fetching: false,
      members,
    })
  }

  render() {
    const { fetching, members } = this.state
    return (
      <section>
        <h1>Åcon X Registration</h1>
        {fetching ? <p>Loading…</p> : <ListTable members={members} />}
      </section>
    )
  }
}

const tableCellStyle = {
  borderTop: '1px dotted gray',
}

const ListTable: React.FunctionComponent<{ members: RegistrationData[] }> = ({ members }) => (
  <table style={{ border: '1px solid gray', width: '100%' }}>
    <thead>
      <tr>
        <th style={{ width: '6%' }}>Arrived</th>
        <th style={{ width: '6%' }}>Printed Badge</th>
        <th style={{ width: '44%', textAlign: 'left' }}>Name</th>
        <th style={{ width: '44%', textAlign: 'left' }}>Badge Name</th>
      </tr>
    </thead>
    <tbody>
      {members.map(m => (
        <tr key={m.memberId} title={m.memberId}>
          <td style={tableCellStyle} />
          <td style={tableCellStyle} align='center'>
            {m.badgePrinted !== false ? '✓️' : ''}
          </td>
          <td style={tableCellStyle}>{m.fullName}</td>
          <td style={tableCellStyle}>{m.badgeName}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default RegistrationList
