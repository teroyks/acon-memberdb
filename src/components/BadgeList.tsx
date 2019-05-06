import * as React from 'react'
import { BadgeData, fetchBadgeData } from '../firestore'

enum Mode {
  table,
  csv,
}

type InputCallback = (event: React.ChangeEvent<HTMLInputElement>) => void

class BadgeList extends React.Component {
  state = {
    fetching: true,
    listMode: Mode.table,
    members: [] as BadgeData[],
  }

  async componentDidMount() {
    const members: BadgeData[] = await fetchBadgeData()
    this.setState({
      fetching: false,
      members,
    })
  }

  handleModeChange: InputCallback = event => {
    this.setState({ listMode: parseInt(event.target.value, null) })
  }

  render() {
    const { fetching, listMode, members } = this.state
    return (
      <section>
        <h1>Members – Badge Data</h1>
        {fetching ? (
          <p>Loading…</p>
        ) : (
          <div>
            <ModeChangeButtons
              currentMode={this.state.listMode}
              modeUpdateFunction={this.handleModeChange}
            />
            <BadgeDataList members={members} mode={listMode} />
          </div>
        )}
      </section>
    )
  }
}

const ModeChangeButtons: React.FunctionComponent<{
  currentMode: Mode
  modeUpdateFunction: InputCallback
}> = ({ currentMode, modeUpdateFunction }) => (
  <p>
    <label>
      <input
        type='radio'
        value={Mode.table}
        checked={currentMode === Mode.table}
        onChange={modeUpdateFunction}
      />
      Table
    </label>
    <label>
      <input
        type='radio'
        value={Mode.csv}
        checked={currentMode === Mode.csv}
        onChange={modeUpdateFunction}
      />
      CSV
    </label>
  </p>
)

const BadgeDataList: React.FunctionComponent<{
  members: BadgeData[]
  mode: Mode
}> = ({ members, mode }) =>
  mode === Mode.table ? <BadgeDataTable members={members} /> : <BadgeDataCSV members={members} />

const tableCellStyle = {
  borderTop: '1px dotted gray',
}

const BadgeDataTable: React.FunctionComponent<{
  members: BadgeData[]
}> = ({ members }) => (
  <table style={{ border: '1px solid gray' }}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Location</th>
        <th>Twitter handle</th>
      </tr>
    </thead>
    <tbody>
      {members.map(m => (
        <tr key={m.displayName}>
          <td style={tableCellStyle}>{m.displayName}</td>
          <td style={tableCellStyle}>{m.location}</td>
          <td style={tableCellStyle}>{m.twitter}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

const BadgeDataCSV: React.FunctionComponent<{ members: BadgeData[] }> = ({ members }) => (
  <pre>
    Name;Location;Twitter
    <br />
    {members.map(m => `${m.displayName};${m.location || ''};${m.twitter || ''}\n`)}
  </pre>
)

export default BadgeList
