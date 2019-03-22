import React, { Component } from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, LineSeries
} from 'react-jsx-highcharts';

import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 180,
    minHeight:20,
    float:'right'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});


const plotOptions = {
  chart: {
    height: 200,
    type: 'line'
  },
  xAxis: {
    type: "datetime",
    "dateTimeLabelFormats": {
      "second": "%H:%M",
      "minute": "%H:%M",
      "hour": "%H:%M",
      "day": "%e-$b-%y",
      "week": "%e",
      "month": "%e",
      "year": "%e"
    },    
  },
  lang: {
    noData: "No Data Found."
  }
};


class SimpleLineChart extends React.Component {

  constructor(props) {
    super(props);   
    this.state = { 
        timerange: ''
    }; 
  } 


  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    const data = this.props.seriesData;
    const title = this.props.title;
    const name = this.props.name;

     return (

      <div> 

        <div className="row end-xs">

          <div className="col-xs-2">
          <div class="live-button">
            Live
            <label class="switch">
              <input class="toggle" type="checkbox"/>
              <span class="slider round"/>
            </label>
          </div>
          {/* <form className={classes.root} autoComplete="off">
                <FormControl className={classes.formControl}>
                <InputLabel htmlFor="timerange-simple">Select Time Range</InputLabel>
                <Select
                  value={this.state.timerange}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'timerange',
                    id: 'timerange-simple',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>3 Hours</MenuItem>
                  <MenuItem value={20}>1 Day</MenuItem>
                  <MenuItem value={30}>7 Days</MenuItem>
                </Select>
              </FormControl>

            </form> */}
           </div>
        </div>
        <HighchartsChart plotOptions={plotOptions}>
        <Chart height={plotOptions.chart.height}/>
  {/* 
        <Title>Solar Employment Growth by Sector, 2010-2016</Title> */}
  {/* 
        <Subtitle>Source: thesolarfoundation.com</Subtitle> */}

        <Legend layout="vertical" align="right" verticalAlign="middle" />

        <XAxis type="datetime">
            <XAxis.Title>Time</XAxis.Title>
        </XAxis>

        <YAxis>
          <YAxis.Title>{title}</YAxis.Title>
          <LineSeries name={name} data={data} />        
        </YAxis>
      </HighchartsChart>
      </div>
     )

  }

};


SimpleLineChart.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withHighcharts(withStyles(styles)(SimpleLineChart), Highcharts);