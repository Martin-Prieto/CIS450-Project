import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllMatches, getAllPlayers } from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;


const playerColumns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
  },
  {
    title: 'Nationality',
    dataIndex: 'Nationality',
    key: 'Nationality',
    sorter: (a, b) => a.Nationality.localeCompare(b.Nationality)
  },
  {
    title: 'Date of Birth',
    dataIndex: 'dateOfBirth',
    key: 'dateOfBirth',
    sorter: (a, b) => a.dateOfBirth - b.dateOfBirth
    
  },
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  {
    title: 'Hand',
    dataIndex: 'hand',
    key: 'hand',    
  },
];

const matchColumns = [
  {
    title: 'Tourney',
    dataIndex: 'tourney',
    key: 'tourney',
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => a.date - b.date,
  },
  {
    title: 'Surface',
    dataIndex: 'surface',
    key: 'surface',
  },
  {
    title: 'Winner',
    dataIndex: 'winner',
    key: 'winner',
    sorter: (a, b) => a.winner - b.winner
    
  },
  {
    title: 'Looser',
    dataIndex: 'looser',
    key: 'loser',   
    sorter: (a, b) => a.looser - b.looser 
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',    
  },

];

class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      playersResults: [],
      pagination: null  
    }

    this.leagueOnChange = this.leagueOnChange.bind(this)
    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  leagueOnChange(value) {
    // TASK 2: this value should be used as a parameter to call getAllMatches in fetcher.js with the parameters page and pageSize set to null
    // then, matchesResults in state should be set to the results returned - see a similar function call in componentDidMount()
    getAllMatches(null, null, value).then(res => {
      this.setState({ matchesResults: res.results })
    })
  }

  componentDidMount() {
    getAllMatches(null, null, 'D1').then(res => {
      this.setState({ matchesResults: res.results })
    })

    getAllPlayers().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      console.log("äsdsad")
      console.log(res.results)
      this.setState({ playersResults: res.results })
    })

 
  }


  render() {

    return (
      <div>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Players</h3>
          <Table dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <h3>Matches</h3>
          <Select defaultValue="D1" style={{ width: 120 }} onChange={this.leagueOnChange}>
            <Option value="D1">Bundesliga</Option>
             {/* TASK 3: Take a look at Dataset Information.md from MS1 and add other options to the selector here  */}
             <Option value="SP1">La Liga</Option>
          </Select>
              <Table dataSource={this.state.matchesResults} columns={matchColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
        </div>


      </div>
    )
  }

}

export default HomePage

