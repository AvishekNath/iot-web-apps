import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LineComponent from '../../line.chart';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import SimpleLineChart from '../../dashboard/SimpleLineChart';
import axios from 'axios';
import { marshallLineChartData } from '../../utils/data-helpers';

const styles = {
   card: {
     marginBottom: '2em',
     maxWidth: '100%',
     display: 'flex',
     flexDirection: 'column',
     flexBasis: '100%',
     flex:1
   }
 };


class GatewayHealthChart extends React.Component {

   constructor(props) {
      super(props);   
      this.state = { 
         'temperatureSeriesData': '',
         'pressureSeriesData': '',
         'humiditySeriesData': '',
         'co2SeriesData': '',
         thresholdCpuTemperature: [{
            value: 90,
            color: 'red',
            dashStyle: 'shortdash',
            width: 1,
            label: {
               text: 'Threshold'
            }
         }],
         thresholdPressure: [{
            value: 940,
            color: 'red',
            dashStyle: 'shortdash',
            width: 1,
            label: {
               text: 'Threshold'
            }
         }],
         thresholdHumidity: [{
            value: 70,
            color: 'red',
            dashStyle: 'shortdash',
            width: 1,
            label: {
               text: 'Threshold'
            }
         }]
      }; 

      this.chartUrl = `https://us-central1-eternal-insight-234909.cloudfunctions.net/ble-rest-endpoint`;
   }

   componentDidMount() { 
      const self = this;

      // Temp
      axios({
         method:'get',
         url: this.chartUrl,
         params: {
            'type': 'sensorattrs',
            'sensor': this.props.tpId.toString(),
            'attr': 'temperature',
            'app_name': 'Thingy52'     
         }
       })
      .then(response => {
         console.log(response);
         let seriesData = marshallLineChartData(response.data);
         console.log(seriesData);
         this.setState({
            temperatureSeriesData: seriesData
         });
      });

      // Humidity
      axios({
         method:'get',
         url: this.chartUrl,
         params: {
            'type': 'sensorattrs',
            'sensor': this.props.tpId.toString(),
            'attr': 'humidity',
            'app_name': 'Thingy52'        
         }
       })
      .then(response => {
         let seriesData = marshallLineChartData(response.data);
         console.log(seriesData);
         this.setState({
            humiditySeriesData: seriesData
         });
      });

      // Pressure
      axios({
         method:'get',
         url: this.chartUrl,
         params: {
            'type': 'sensorattrs',
            'sensor': this.props.tpId.toString(),
            'attr': 'pressure',
            'app_name': 'Thingy52'      
         }
       })
      .then(response => {
         let seriesData = marshallLineChartData(response.data);
         console.log(seriesData);
         this.setState({
            pressureSeriesData: seriesData
         });
      });
   }

   render(){
      const { classes, tpId } = this.props;

       return (
         <div className="container"> 

            <div className="row">
               <div className="col-xs">
                  <div className="card">
                  <Typography variant="subheading" color="textSecondary" gutterBottom>
                     Temperature
                  </Typography>
 
                  <SimpleLineChart 
                  seriesData={this.state.temperatureSeriesData}
                  title="Temperature (Celcius)"
                  name="temperature"
                  isLive={false}
                  yAxisMax={100}
                  plotLines={this.state.thresholdCpuTemperature}
                  />
                  </div>
               </div>
            </div> 

            <div className="row">
               <div className="col-xs">
                  <div className="card">
                  <Typography variant="subheading" color="textSecondary" gutterBottom>
                     Pressure
                  </Typography>
 
                  <SimpleLineChart 
                  seriesData={this.state.pressureSeriesData}
                  title="Pressure (hPa)"
                  name="pressure"
                  yAxisMax={1000}
                  plotLines={this.state.thresholdPressure}
                  />
                  </div>
               </div>
            </div>  
            

            <div className="row">
               <div className="col-xs">
                  <div className="card">
                  <Typography variant="subheading" color="textSecondary" gutterBottom>
                     Humidity
                  </Typography>
 
                  <SimpleLineChart 
                  seriesData={this.state.humiditySeriesData}
                  title="Humidity (%)"
                  name="humidity"
                  yAxisMax={100}
                  plotLines={this.state.thresholdHumidity}
                  />
                  </div>
               </div>
            </div>

            
 


         </div> 
       )
   }
}

GatewayHealthChart.propTypes = {
   classes: PropTypes.object.isRequired,
 };
 
 export default withStyles(styles)(GatewayHealthChart);