import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllMatches, getAllPlayers, getPlayerMatches } from '../fetcher'
import background from "../Images/red2.png";
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

const matchColumns = [
  {
    title: 'Tourney',
    dataIndex: 'tourney',
    key: 'tourney',
    sorter: (a, b) => a.Name.localeCompare(b.tName),
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
    sorter: (a, b) => a.winner - b.winner,
    render: (text, row) => <a href={`/players?id=${row.WinnerId}`}>{text}</a>
  },
  {
    title: 'Loser',
    dataIndex: 'loser',
    key: 'loser',   
    sorter: (a, b) => a.loser - b.loser,
    render: (text, row) => <a href={`/players?id=${row.LooserId}`}>{text}</a> 
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',    
  },

  {
    title: 'Round',
    dataIndex: 'round',
    key: 'round',    
  },

];

class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      winnerMatchResults: null,
      looserMatchResults: null,
      playerIdQuery: '',
      tourneyQuery: '',
      dateQuery: '',
      pagination: null  
    }

    this.leagueOnChange = this.leagueOnChange.bind(this)
    this.goToMatch = this.goToMatch.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.handleCheckboxProps = this.handleCheckboxProps.bind(this)
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
    getAllMatches(null, null, 'All').then(res => {
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

  handleCheckbox(selectedRowKeys, selectedRows){

    getPlayerMatches(selectedRows[0].WinnerId, selectedRows[0].tourney, selectedRows[0].date).then(res => {
        this.setState({ winnerMatchResults: res.results })
    })

    getPlayerMatches(selectedRows[0].LoserId, selectedRows[0].tourney, selectedRows[0].date).then(res => {
        this.setState({ looserMatchResults: res.results })
    })
    console.log(selectedRows[0].LoserId);
  }

  handleCheckboxProps = (record) => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  });

  



  render() {

    return (
      <div style={{ backgroundImage: `url(${background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', position: 'absolute', top: '0', bottom: '0', width: '100%'}}>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <h3 style={{ color:'white' }}>Matches</h3>
              <Table dataSource={this.state.matchesResults} rowSelection={{type: "radio", onChange: this.handleCheckbox, getCheckboxProps: this.handleCheckboxProps,}} columns={matchColumns} pagination={{ pageSize:50 }} scroll={{ y: 200 }}/>
        </div>
        <div style={{display: 'flex'}}>
            {this.state.looserMatchResults ? <div style={{ width: '50vw', margin: '0 2vh', marginTop: '2vh' }}>
                <h3 style={{ color:'white' }}>Winner</h3>
                <Table dataSource={this.state.winnerMatchResults} columns={matchColumns} pagination={{ pageSize:50 }} scroll={{ y: 200 }}/>
            </div> : null}

            {this.state.looserMatchResults ? <div style={{ width: '50vw', margin: '0 2vh', marginTop: '2vh' }}>
                <h3 style={{ color:'white' }}>Loser</h3>
                <Table dataSource={this.state.looserMatchResults} columns={matchColumns} pagination={{ pageSize:50 }} scroll={{ y: 200 }}/>
            </div>: null}
        </div>
      </div>
    )
  }

}

export default HomePage
