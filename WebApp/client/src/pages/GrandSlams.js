import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllMatches, getAllPlayers, getChampions } from '../fetcher'
import background from "../Images/red2.png";
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const championColumns = [
  {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
  },
  {
    title: 'Champion',
    dataIndex: 'champion',
    key: 'champion',
  },

];



const playerColumns = [
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
    sorter: (a, b) => a.Name.localeCompare(b.Name),
    render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>
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
    title: 'Loser',
    dataIndex: 'loser',
    key: 'loser',   
    sorter: (a, b) => a.loser - b.loser 
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',    
  },

];

class GrandSlams extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      championResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      playersResults: [],
      pagination: null  
    }

    this.tourneyOnChange = this.tourneyOnChange.bind(this)
    this.goToMatch = this.goToMatch.bind(this)
  }


  goToMatch(matchId) {
    window.location = `/matches?id=${matchId}`
  }

  tourneyOnChange(value) {
    console.log(value)
    // TASK 2: this value should be used as a parameter to call getAllMatches in fetcher.js with the parameters page and pageSize set to null
    // then, matchesResults in state should be set to the results returned - see a similar function call in componentDidMount()
    getAllMatches(null, null, value).then(res => {
      this.setState({ matchesResults: res.results })
    })

    getChampions(null, null, value).then(res => {
      this.setState({ championResults: res.results })
    })
  }

  componentDidMount() {
    getAllMatches(null, null, 'Wimbledon').then(res => {
      this.setState({ matchesResults: res.results })
    })

    getChampions(null, null, 'Wimbledon').then(res => {
      this.setState({ championResults: res.results })
    })

    getAllPlayers().then(res => {
      console.log(res.results)
      // TASK 1: set the correct state attribute to res.results
      console.log(res.results)
      this.setState({ playersResults: res.results })
    })

 
  }


  render() {

    return (
      <div style={{ backgroundImage: `url(${background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', position: 'absolute', top: '0', bottom: '0', width: '100%'}}>
        <MenuBar />
        <div style={{display: 'flex'}}>
          <div style={{marginRight: '8vw'}}>
            <div style={{ width: '50vw', margin: '0 2vh', marginTop: '0' }}>
              <h3 style={{color: 'white'}}>Grand Slams</h3>
              <Select defaultValue="Wimbledon" style={{ width: 120 }} onChange={this.tourneyOnChange}>
                <Option value="Wimbledon">Wimbledon</Option>
                <Option value="US Open">US Open</Option>
                <Option value="Australian Open">Australian Open</Option>
                <Option value="Roland Garros">Roland Garros</Option>
              </Select>
                  <Table dataSource={this.state.matchesResults} columns={matchColumns}  pagination={{ pageSize:50 }} scroll={{ y: 200 }}/>
            </div>
            <div style={{ width: '50vw', margin: '0 2vh', marginTop: '0' }}>
              <h3 style={{color: 'white'}}>Champions</h3>
              <Table dataSource={this.state.championResults} columns={championColumns}  pagination={{ pageSize:50 }} scroll={{ y: 200 }}/>
            </div>
          </div>
          <div style={{swidth: '30vw', margin: '0 0', marginTop: '5vh' }}>
              <h3 style={{color: 'white'}}>Aggregate</h3>
              <Table dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 5], defaultPageSize: 5, showQuickJumper:true }}/>
          </div>
        </div>
      </div>
    )
  }

}

export default GrandSlams

