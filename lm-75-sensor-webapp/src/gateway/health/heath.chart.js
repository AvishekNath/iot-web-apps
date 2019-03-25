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
         'temperatureSeriesData': [],
         'thresholdCpuUsage': [{
            value: 90,
            color: 'red',
            dashStyle: 'shortdash',
            width: 2,
            label: {
               text: 'Threshold'
            }
         }],
      }; 

      this.chartUrl = `https://us-central1-eternal-insight-234909.cloudfunctions.net/lm75-rest-endpoint`;
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
            'app_name': 'lm75'     
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
   }

   render() {
      const { classes } = this.props;

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
                  title="Temperature (%)"
                  name="Temperature" 
                  yAxisMax={90}
                  plotLines={this.state.thresholdCpuUsage}
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