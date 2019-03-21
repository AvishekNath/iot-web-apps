import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LineComponent from './line.chart';
//import DenseAppBar from './appbar';
import {connectToFireStore, connectUsingFirebase, subscribeForRealTimeUpdatesOnDatabase} from './firestore-connection';

import GatewayManagement from './gateway/gateway.index';
import GatewayHealth from './gateway/health/health.index';

import history from './history.js';
import { AppBar } from '@material-ui/core/AppBar';
//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Dashboard from './dashboard/Dashboard';


class App extends React.Component {

  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
   // this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }

  render(){
    return(

        <Dashboard></Dashboard>


      // <div className="App">
      //   <Router>      
      //     <Route path="/thing_point/:serial/" exact component={(props) => <LineComponent {...props}/>} />
      //     <Route path="/gateway/" exact component={(props) => <GatewayManagement {...props}/>} />
      //     <Route path="/health/:macid/" exact component={(props) => <GatewayHealth {...props}/>} />
      //   </Router> 
      // </div> 
    );
  }
}

 
export default App;