import { Component } from 'react' ;
import React from 'react';

import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend, LineSeries
} from 'react-jsx-highcharts';
import { createRandomData, addDataPoint, getCurrentTimeUTC, addSensorData} from './utils/data-helpers';
import moment from 'moment';
import {connectToFireStore, connectUsingFirebase, subscribeForRealTimeUpdatesOnDatabase} from './firestore-connection';
import Button from '@material-ui/core/Button';
import PubNub from 'pubnub';


class LineChart extends Component {

  constructor (props) {
    super(props);
    this.updateLiveData = this.updateLiveData.bind(this);
    this.handleStartLiveUpdate = this.handleStartLiveUpdate.bind(this);
    this.handleStopLiveUpdate = this.handleStopLiveUpdate.bind(this);

    var pubnub = new PubNub({
      subscribeKey: "mySubscribeKey",
      publishKey: "myPublishKey",
      secretKey: "secretKey",
      ssl: true
  });


    //const now = getCurrentTimeUTC();
    this.state = {
      data1: createRandomData(),
      // data2: createRandomData(now),
      liveUpdate: false
    };
    let serial = '';
    if(this.props.match){
      serial = this.props.match.params.serial;
    }
    let collectionName = 'thing_point_' + serial;
    if(collectionName){
      let db = connectUsingFirebase(collectionName);
      subscribeForRealTimeUpdatesOnDatabase(db.collection(collectionName), function(data){
        //this.setState({data1: data});
        console.log('Sensor Data:->', data.temperature, getCurrentTimeUTC(data.timestamp * 1000));
        this.setState({
          data1: addSensorData(this.state.data1, [
            getCurrentTimeUTC(data.timestamp * 1000), // Unix to UTC in Milliseconds
            data.temperature
          ])
        });
       // console.log('sensorData:->', data);
      }.bind(this));
    }
    //console.log(createRandomData(now));
  }

  componentDidMount () {
    //this.handleStartLiveUpdate();
  }

  updateLiveData () {
    const { data1, data2 } = this.state;
    this.setState({
      data1: addDataPoint(data1) //,
      // data2: addDataPoint(data2)
    });
  }

  handleStartLiveUpdate (e) {
    e && e.preventDefault();
    this.setState({
      liveUpdate: window.setInterval(this.updateLiveData, 1000 * 2)
    });
  }

  handleStopLiveUpdate (e) {
    e.preventDefault();
    window.clearInterval(this.state.liveUpdate);
    this.setState({
      liveUpdate: false
    });
  }

  componentDidUpdate(previousProps, previousState) {
    // const newProps = this.props;
    // if(this.state.data1) {
    //   this.setState({
    //     data1: addSensorData(previousState.data1, [
    //       getCurrentTimeUTC(this.state.data1.timestamp * 1000), // Unix to UTC in Milliseconds
    //       this.state.data1.temperature
    //     ])
    //   });
    // }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   console.log(nextProps, nextState);
  // }

  render() {
    const { data1, data2, liveUpdate } = this.state;
    const title = this.props.title || 'Dynamically updating Sensor Data`';
    return (
      <div className="app">
        {/* Temperature: {this.data1.temperature}, 
        Timestamp :: {moment(this.data1.timestamp * 1000).format('YYYY-MM-DD, HH:mm:ss')} */}

        <HighchartsChart>
          <Chart />

          <Title>{title}</Title>

          <Legend>
            <Legend.Title>Legend</Legend.Title>
          </Legend>

          <XAxis type="datetime">
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis >
            <YAxis.Title>Temperature (Celcius &#176;)</YAxis.Title>  
            <LineSeries name="Temperature Sensor" data={data1} />
            {/* <LineSeries name="Sensor 2" data={data2} /> */}
          </YAxis>
        </HighchartsChart>

        {/* <div>
          {!liveUpdate && (
            <button className="btn btn-success" onClick={this.handleStartLiveUpdate}>Live update</button>
          )}
          {liveUpdate && (
            <button className="btn btn-danger" onClick={this.handleStopLiveUpdate}>Stop update</button>
          )}
        </div> */}

          {/* <Button variant="contained" color="primary">
            Primary
          </Button> */}

      </div>
    );
  }
}

export default withHighcharts(LineChart, Highcharts);