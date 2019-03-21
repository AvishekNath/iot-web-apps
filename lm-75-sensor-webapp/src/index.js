import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import './flexboxgrid.css';

// import App from './App';
import * as serviceWorker from './serviceWorker';
import LineComponent from './line.chart';
import DenseAppBar from './appbar';
import { Router, Route, Link, Switch} from "react-router-dom";
import history from './history.js';
import App from './App';

/*
const routing = (
    <Router history={history}>
      <div>
        {/* <DenseAppBar/> }
        <Switch>
            <Route path="/thing_point/:serial/" exact component={(props) => <LineComponent {...props}/>} />
            <Route path="/gateway/" exact component={(props) => <GatewayManagement {...props}/>} />
            <Route path="/health/:macid/" exact component={(props) => <GatewayHealth {...props}/>} />
            <Route path="/dashboard/" exact component={(props) => <Dashboard {...props}/>} />
        </Switch>
      </div>
    </Router>
  )

  */

ReactDOM.render(<App/>, document.getElementById('root'));   

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
