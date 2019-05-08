import * as React from 'react'
import { RegistrationData } from '../firestore'

class RegistrationList extends React.Component {
  state = {
    fetching: true,
    members: [] as RegistrationData[],
  }

  async componentDidMount() {
    this.setState({
      fetching: false,
      members: [
        { fullName: 'foo bar', badgeName: null },
        { fullName: 'Joo Jaa', badgeName: 'Jooppi' },
      ],
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
        <th style={{ width: '6%' }}>Arrival</th>
        <th style={{ width: '47%', textAlign: 'left' }}>Name</th>
        <th style={{ width: '47%', textAlign: 'left' }}>Badge Name</th>
      </tr>
    </thead>
    <tbody>
      {members.map(m => (
        <tr key={m.fullName}>
          <td style={tableCellStyle} />
          <td style={tableCellStyle}>{m.fullName}</td>
          <td style={tableCellStyle}>{m.badgeName}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default RegistrationList
