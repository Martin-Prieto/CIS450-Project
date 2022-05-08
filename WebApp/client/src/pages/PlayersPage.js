import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";
import { getAdvancedDetails, getAllPlayers } from '../fetcher'

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate 
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';
import background from "../Images/red2.png";




import MenuBar from '../components/MenuBar';
import { getPlayerSearch, getPlayer } from '../fetcher'
const wideFormat = format('.3r');

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


class PlayersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nameQuery: '',
            nationalityQuery: '',
            handQuery: '',
            birthHighQuery: 2024,
            birthLowQuery: 0,
            timeHighQuery: 2024,
            timeLowQuery: 0,
            selectedPlayerId: window.location.search ? window.location.search.substring(1).split('=')[1] : 229594,
            selectedPlayerDetails: null,
            advancedPlayerDetails: null,
            playersResults: []

        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.handleNationalityQueryChange = this.handleNationalityQueryChange.bind(this)
        this.handleHandQueryChange = this.handleHandQueryChange.bind(this)
        this.handleBirthChange = this.handleBirthChange.bind(this)
        this.handleTimeChange = this.handleTimeChange.bind(this)
    }

    

    handleNameQueryChange(event) {
        this.setState({ nameQuery: event.target.value })
    }

    handleHandQueryChange(event) {
        // TASK 20: update state variables appropriately. See handleNameQueryChange(event) for reference
        this.setState({ handQuery: event.target.value })
    }

    handleNationalityQueryChange(event) {
        // TASK 21: update state variables appropriately. See handleNameQueryChange(event) for reference
        this.setState({ nationalityQuery: event.target.value })
    }

    handleBirthChange(value) {
        this.setState({ birthLowQuery: value[0] })
        this.setState({ birthHighQuery: value[1] })
    }

    handleTimeChange(value) {
        this.setState({ timeLowQuery: value[0] })
        this.setState({ timeHighQuery: value[1] })
    }



    updateSearchResults() {
        //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
        getPlayerSearch(this.state.nameQuery, this.state.nationalityQuery, this.state.handQuery, this.state.birthHighQuery, this.state.birthLowQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })

        getAdvancedDetails(this.state.selectedPlayerId, this.state.timeHighQuery, this.state.timeLowQuery).then(res => {
            this.setState({ advancedPlayerDetails: res.results[0] })
        })
    }

    componentDidMount() {
        getPlayerSearch(this.state.nameQuery, this.state.nationalityQuery, this.state.handQuery, this.state.birthHighQuery, this.state.birthLowQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })

        getAllPlayers().then(res => {
            // TASK 1: set the correct state attribute to res.results
            this.setState({ playersResults: res.results })
          })

        // TASK 25: call getPlayer with the appropriate parameter and set update the correct state variable. 
        // See the usage of getMatch in the componentDidMount method of MatchesPage for a hint! 
        getPlayer(this.state.selectedPlayerId).then(res => {
            this.setState({ selectedPlayerDetails: res.results[0] })
        })

        getAdvancedDetails(this.state.selectedPlayerId, this.state.timeHighQuery, this.state.timeLowQuery).then(res => {
            console.log(res.results)
            this.setState({ advancedPlayerDetails: res.results[0] })
        })



    }

    render() {
        return (

            <div style={{ backgroundImage: `url(${background})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', position: 'absolute', top: '0', bottom: '0', width: '100%'}}>

                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label style={{color:'white'}}>Name</label>
                            <FormInput placeholder="Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label style={{color:'white'}}>Nationality</label>
                            <FormInput placeholder="Nationality" value={this.state.nationalityQuery} onChange={this.handleNationalityQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label style={{color:'white'}}>Hand</label>
                            <FormInput placeholder="Hand" value={this.state.handQuery} onChange={this.handleHandQueryChange} />
                        </FormGroup></Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col flex={2}>
                            <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                                <label style={{color:'white'}}>Date of birth</label>
                                <Slider  min={1970} max={2022} range defaultValue={[1970, 2022]} onChange={this.handleBirthChange} />
                            </FormGroup>
                        </Col>
                        {/* TASK 27: Create a column with a label and slider in a FormGroup item for filtering by Potential. See the column above for reference and use the onChange method (handlePotentialChange)  */}
            
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>


                </Form>
                <Divider />
                {/* TASK 24: Copy in the players table from the Home page, but use the following style tag: style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} - this should be one line of code! */}
                <div style={{ margin: '0 2vh', marginTop: '2vh', display: 'flex' }}>
                    <div style={{ width: '90vw', margin: '0 2vh'}}>
                    <h3 style={{color:'white'}}>Players</h3>
                    <Table dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                    </div> 
                    {this.state.selectedPlayerDetails ? <div style={{ width: '100vw', marginTop: '10vh'}}>
                    <Card>
                    
                    <CardBody>
                    <Row gutter='30' align='middle' justify='center'>
                        <Col flex={2} style={{ textAlign: 'left' }}>
                        <h3>{this.state.selectedPlayerDetails.Name}</h3>
                        <Row>
                                Age: {this.state.selectedPlayerDetails.age}
                            </Row>
                            <Row>
                                Height: {this.state.selectedPlayerDetails.height}
                            </Row>
                            <Row>
                                Nationality: {this.state.selectedPlayerDetails.Nationality}
                            </Row>
                        </Col>
                        <Col flex={2} style={{ align: 'right'}}>
                            <Col style={{ align: 'middle'}}>
                                <Button onClick={this.updateSearchResults}>Apply time range</Button> 
                            </Col>
                            <Slider  min={1970} max={2022} range defaultValue={[1970, 2022]} onChange={this.handleTimeChange} />
                            {this.state.advancedPlayerDetails ? <div>
                                <Row>
                                Best Surface: {this.state.advancedPlayerDetails.BestSurface}
                            </Row>
                            <Row>
                                Money Earned: {this.state.advancedPlayerDetails.Money}
                            </Row>
                            <Row>
                                Wins: {this.state.advancedPlayerDetails.Wins}
                            </Row>
                            <Row>
                                Losses: {this.state.advancedPlayerDetails.Losses}
                            </Row>
                            </div>: null}     
                        </Col>
                    </Row>
                    </CardBody>

                </Card>
                </div> : null}
                </div>
                <Divider />

                

            </div>
        )
    }
}

export default PlayersPage

