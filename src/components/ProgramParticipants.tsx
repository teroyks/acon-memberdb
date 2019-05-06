import * as React from 'react'
import * as db from '../firestore'

class ProgramParticipants extends React.Component {
  state = {
    fetching: true,
    participants: [],
  }

  async componentDidMount() {
    const participants: db.ProgramParticipantData[] = await db.fetchProgramParticipants()
    this.setState({
      fetching: false,
      participants,
    })
  }

  render() {
    const { fetching, participants } = this.state
    return (
      <section>
        <h1>Program Participant Volunteers</h1>
        {fetching ? <p>Loading…</p> : <ParticipantsList people={participants} />}
      </section>
    )
  }
}

const ParticipantsList: React.FunctionComponent<{ people: db.ProgramParticipantData[] }> = ({
  people,
}) => (
  <table>
    <tbody>
      {people.map(person => (
        <Participant person={person} key={person.fullName} />
      ))}
    </tbody>
  </table>
)

const Participant: React.FunctionComponent<{ person: db.ProgramParticipantData }> = ({
  person: { displayName, email, fullName, memberId, participateProgram, participateProgramAnswer },
}) => (
  <tr>
    <td>{displayName !== fullName ? `${displayName} (${fullName})` : fullName}</td>
    <td>{email}</td>
    <td>{participateProgram ? '✅' : '*️⃣'}</td>
    <td>
      {participateProgram || !participateProgramAnswer ? (
        ''
      ) : (
        <span title={memberId}>({participateProgramAnswer})</span>
      )}
    </td>
  </tr>
)

export default ProgramParticipants
