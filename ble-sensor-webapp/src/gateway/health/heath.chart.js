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
         'pressureSeriesData': '',
         'humiditySeriesData': '',
         'co2SeriesData': ''
      }; 
    } 

    render() {
      const { classes } = this.props;

       return (
         <div className="container"> 

            <div className="row">
               <div className="col-xs">
                  <div className="card">
                  <Typography variant="subheading" color="textSecondary" gutterBottom>
                     Pressure
                  </Typography>
 
                  <SimpleLineChart 
                  seriesData={[50,60, 90, 80 , 50, 40, 20 ,60]}
                  title="Pressure"
                  name="pressure"
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
                  seriesData={[50,60, 90, 80 , 50, 40, 20 ,60]}
                  title="Humidity"
                  name="humidity"
                  />
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-xs">
                  <div className="card">
                  <Typography variant="subheading" color="textSecondary" gutterBottom>
                     CO2
                  </Typography>
 
                  <SimpleLineChart 
                  seriesData={[50,60, 90, 80 , 50, 40, 20 ,60]}
                  title="CO2"
                  name="co2"
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