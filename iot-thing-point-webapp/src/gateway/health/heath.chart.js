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
         'freeMemorySeriesData': '',
         'cpuUsageSeriesData': '',
         'thresholdCpuUsage': [{
            value: 90,
            color: 'red',
            dashStyle: 'shortdash',
            width: 1,
            label: {
               text: 'Threshold'
            }
         }],
         'thresholdfreemomory': [{
            value: 900,
            color: 'red',
            dashStyle: 'shortdash',
            width: 1,
            label: {
               text: 'Threshold'
            }
         }]
      }; 
      

      this.chartUrl = `https://us-central1-sage-buttress-230707.cloudfunctions.net/Visibility-server`;
   }
 
   componentDidMount() { 

      // Free mem
      axios({
         method:'get',
         url: this.chartUrl,
         params: {
            'type': 'healthchart',
            'serial': this.props.serial,
            'attribute': 'freemem'
         }
       })
      .then(response => {
         console.log(response);
         let seriesData = marshallLineChartData(response.data);
         console.log(seriesData);
         this.setState({
            freeMemorySeriesData: seriesData
         });
      });

      // CPU
      axios({
         method:'get',
         url: this.chartUrl,
         params: {
            'type': 'healthchart',
            'serial': this.props.serial,
            'attribute': 'cpu_usage'
         }
       })
      .then(response => {
         let seriesData = marshallLineChartData(response.data);
         console.log(seriesData);
         this.setState({
            cpuUsageSeriesData: seriesData
         });
      });

   }
   
   render() {
      const { classes } = this.props;

       return (
         <div className="container">
            <div className="row">
               <div className="col-xs">
                  <div className="card">
                  <Typography variant="subheading" color="textSecondary" gutterBottom>
                     CPU Usage
                  </Typography>
 
                  <SimpleLineChart 
                  seriesData={this.state.cpuUsageSeriesData} isLive={false} yAxisMax={100}
                  title="CPU Usage (%)"
                  name="Usage"
                  plotLines={this.state.thresholdCpuUsage}
                  />

                  </div>
               </div>
      
            </div> 
          

            <div className="row">
               <div className="col-xs">
                  <div className="card">
                  <Typography variant="subheading" color="textSecondary" gutterBottom>
                     Memory Usage
                  </Typography>
 
                  <SimpleLineChart 
                  seriesData={this.state.freeMemorySeriesData} isLive={false} yAxisMax={1000}
                  title="Memory Usage (Mb)"
                  name="Memory"
                  plotLines={this.state.thresholdfreemomory}
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