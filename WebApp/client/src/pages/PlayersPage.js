import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";
import { getAllMatches, getAllPlayers } from '../fetcher'

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
            selectedPlayerId: window.location.search ? window.location.search.substring(1).split('=')[1] : 229594,
            selectedPlayerDetails: null,
            playersResults: []

        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.handleNationalityQueryChange = this.handleNationalityQueryChange.bind(this)
        this.handleHandQueryChange = this.handleHandQueryChange.bind(this)
        this.handleBirthChange = this.handleBirthChange.bind(this)
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

    updateSearchResults() {
        //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
        getPlayerSearch(this.state.nameQuery, this.state.nationalityQuery, this.state.handQuery, this.state.birthHighQuery, this.state.birthLowQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })
    }

    componentDidMount() {
        getPlayerSearch(this.state.nameQuery, this.state.nationalityQuery, this.state.handQuery, this.state.birthHighQuery, this.state.birthLowQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })

        getAllPlayers().then(res => {
            console.log(res.results)
            // TASK 1: set the correct state attribute to res.results
            console.log("äsdsad")
            console.log(res.results)
            this.setState({ playersResults: res.results })
          })

        // TASK 25: call getPlayer with the appropriate parameter and set update the correct state variable. 
        // See the usage of getMatch in the componentDidMount method of MatchesPage for a hint! 
        getPlayer(this.state.selectedPlayerId).then(res => {
            this.setState({ selectedPlayerDetails: res.results[0] })
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
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <h3 style={{color:'white'}}>Players</h3>
                    <Table dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </div>
                <Divider />

                {this.state.selectedPlayerDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                    
                        <CardBody>
                        <Row gutter='30' align='middle' justify='center'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            <h3>{this.state.selectedPlayerDetails.Name}</h3>

                            </Col>

                            <Col flex={2} style={{ textAlign: 'right' }}>
                            <img src={this.state.selectedPlayerDetails.Photo} referrerpolicy="no-referrer" alt={null} style={{height:'15vh'}}/>

                            </Col>
                        </Row>
                            <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                <h5>{this.state.selectedPlayerDetails.Hand}</h5>
                                </Col>
                                <Col>
                                <h5>{this.state.selectedPlayerDetails.JerseyNumber}</h5>
                                </Col>
                                <Col>
                                <h5>{this.state.selectedPlayerDetails.BestPosition}</h5>
                                </Col>
                            </Row>
                            <br>
                            </br>
                            <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Age: {this.state.selectedPlayerDetails.age}
                                </Col>
                                {/* TASK 28: add two more columns here for Height and Weight, with the appropriate labels as above */}
                                <Col>
                                Height: {this.state.selectedPlayerDetails.height}
                                </Col>
                                <Col>
                                Weight: {this.state.selectedPlayerDetails.Weight}
                                </Col>
                                <Col flex={2} style={{ textAlign: 'right' }}>
                                {this.state.selectedPlayerDetails.Nationality}
                                    <img src={this.state.selectedPlayerDetails.Flag} referrerpolicy="no-referrer" alt={null} style={{height:'3vh', marginLeft: '1vw'}}/>
                                </Col>

                            </Row>
                            <Row gutter='30' align='middle' justify='left'>
                                <Col>
                                Value: {this.state.selectedPlayerDetails.Value}
                                </Col>
                                <Col>
                                Release Clause: {this.state.selectedPlayerDetails.ReleaseClause}
                                </Col>
                                {/* TASK 29: Create 2 additional columns for the attributes 'Wage' and 'Contract Valid Until' (use spaces between the words when labelling!) */}
                                <Col>
                                Wage: {this.state.selectedPlayerDetails.Wage}
                                </Col>
                                <Col>
                                Contract Valid Until: {this.state.selectedPlayerDetails.ContractValidUntil}
                                </Col>                            
                            </Row>
                        </CardBody>

                    </Card>

                    <Card style={{marginTop: '2vh'}}>
                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                            <h6>Skill</h6>
                            <Rate disabled defaultValue={this.state.selectedPlayerDetails.Skill} />
                            <h6>International Reputation</h6>
                            <Rate disabled defaultValue={this.state.selectedPlayerDetails.InternationalReputation} />
                            <Divider/>
                            <h6>Best Rating</h6>
                                <Progress style={{ width: '20vw'}} value={this.state.selectedPlayerDetails.BestOverallRating} >{this.state.selectedPlayerDetails.BestOverallRating}</Progress>
                                
                            <h6>Potential</h6>
                                <Progress style={{ width: '20vw'}} value={this.state.selectedPlayerDetails.Potential} >{this.state.selectedPlayerDetails.Potential}</Progress>    
                                
                            <h6>Rating</h6>
                                <Progress style={{ width: '20vw'}} value={this.state.selectedPlayerDetails.Rating} >{this.state.selectedPlayerDetails.Rating}</Progress>    
                                </Col >
                                <Col  push={2} flex={2}>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                </div> : null}

            </div>
        )
    }
}

export default PlayersPage

