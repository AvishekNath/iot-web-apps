import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const styles = {
  root: {
    flexGrow: 1,
    width: '100%'
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
  },
};

function DenseAppBar(props) {
  
  const { classes } = props;
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense" color="primary">
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
       
            <nav className="nav-links">
            <ul>
              <li>
                <Link to="/thing_point/0000000024c500f6/">Thing Point (0000000024c500f6)</Link>
              </li> 
              <li>
                <Link to="/gateway/">Thing Management DashBoard</Link>
              </li> 
            </ul>
          </nav> 
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

DenseAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DenseAppBar);