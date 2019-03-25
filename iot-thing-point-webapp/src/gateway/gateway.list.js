import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Brightness1 from '@material-ui/icons/Brightness1';
import {connectToFireStore, connectUsingFirebase, subscribeForRealTimeUpdatesOnDatabase} from '../firestore-connection';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import history from '../history.js';
import axios from 'axios';
import Example from './gateway.chart';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';
import { TrendingUp, TrendingDown } from '@material-ui/icons';
import Link from '@material-ui/core/Link';
import { classNames } from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '1em'
  },
  table: {
    minWidth: 700,
    marginTop: '1em'
  },
  active: {
    fontSize: 12,
    color: '#32CD32'
  },
  offline: {
    fontSize: 12,
    color: '#CCC'
  },
  health: {
      good: {
        color: '#32CD32',
        border: '1px solid #000',
        backgroundColor: '#8bc34a'
      },
      bad: {
        color: '#DC143C'
      }
  },
  card: {
    maxWidth: '33.33%',
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '100%',
    flex:1
  },
  title: {
      color: '#FFF'
  },
  totalHealth: {
    color: '#FFF',
    backgroundColor: '#2196f3',
    borderRadius: '15px',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    display: 'inline-block',
    paddingTop: '5px',
    fontSize: '1.2em'
  },
  onlineHealth: {
    color: '#FFF',
    backgroundColor: '#8bc34a',
    borderRadius: '15px',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    display: 'inline-block',
    paddingTop: '5px',
    fontSize: '1.2em'
  },
  offlineHealth: {
    color: '#FFF',
    backgroundColor: '#999',
    borderRadius: '15px',
    width: '30px',
    height: '30px',
    textAlign: 'center',
    display: 'inline-block',
    paddingTop: '5px',
    fontSize: '1.2em'
  },
  list: {
    marginTop: '2em'
  },
  fabActive: {
    color: '#FFF',
    backgroundColor: '#8bc34a'
  },
  fabOffline: {
    color: '#FFF',
    backgroundColor: '#f44336'
  },
  inline: {
    display: 'inline-block',
    paddingRight: '3em',
    paddingTop: '.7em',
    width: '100px',
    fontSize: '1.2em'
  },
  rowMargin: {
    marginBottom: '1.3em'
  }
});


const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: '#607d8b',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  

let id = 0;
function createData(mac, hostname, location, bundleid, status, health) {
  id += 1;
  return { id, mac, hostname, location, bundleid, status, health };
}

const rows = [
  createData('128.0.0.0', 'hostname1', 'location1' , 'Default', true, 1),
  createData('128.0.66.0', 'hostname2', 'location2' , 'Default', false, 2),
  createData('128.0.0.1', 'hostname3', 'location3' , 'Default', true, 1)
];

class GatewayDashBoard extends React.Component {

    constructor(props) {
        super(props);   
        this.state = { 
            rows: [], 
            total: 0,
            online: 0,
            offline: 0
        }; 
    } 

    componentDidMount() {
      let docRows = [];
      let online = 0;
      let offline = 0;
      axios.get(`https://us-central1-sage-buttress-230707.cloudfunctions.net/Visibility-server?type=thingpointlist`)
        .then(res => {
          let data = res.data;    
          data.forEach(function(doc) {
            docRows.push(doc);
            if(doc.status === true){
                online+=1;
            }
            if(doc.status === false){
                offline+=1;
            }
          });

          this.setState({
            rows: docRows,
            total: docRows.length,
            online: online,
            offline: offline
          });
      });
    }
  

    redirectToTarget(mac){
      history.push('/health/' + mac + '/');
    }

    redirectToSnap(id){
      history.push('/snap/' + id + '/');
    }

    render(){
      const { classes } = this.props;
      const { rows, total, online, offline } = this.state;

      return(   

       <div className="container">
        
        {/* <div className="row">
          <div className="col-xs">
              <div className="card">
              <Typography variant="subheading" color="textSecondary" gutterBottom>
                Thing Point Status Count 
              </Typography>

              <div className="row center-xs">
                <div className="col-xs-6">
                    <div className="box">
                      <Example online={online} offline={offline}/>
                    </div>
                </div> 

                             
              </div>              
              </div>
          </div>
 
        </div>  */}


        <div className="row">
          <div className="col-xs">
              <div className="card">
              <Typography variant="subheading" color="textSecondary" gutterBottom>
                Thing Point List
              </Typography>
              <div className="row-count">
              <div className="row">            
                  <div className="col-xs">
                    <Typography component="h6" variant="display1" gutterBottom className={classes.inline}> Online</Typography>
                    <Typography component="h6" variant="display1" className={classes.onlineHealth} gutterBottom>{online}</Typography>
                  </div>

                  <div className="col-xs">

                    <Typography component="h6" variant="display1" gutterBottom className={classes.inline}> Offline</Typography>
                    <Typography component="h6" variant="display1" className={classes.offlineHealth} gutterBottom>{offline}</Typography>
                  </div>

                  <div className="col-xs">
                    <Typography component="h6" variant="display1" gutterBottom className={classes.inline}> Total</Typography>
                    <Typography component="h6" variant="display1" className={classes.totalHealth} gutterBottom>{total}</Typography>
                  </div> 
                </div>
              </div>

              <Table className={classes.table}>
          <TableHead>
              <TableRow>
                  <CustomTableCell>Mac Address</CustomTableCell>
                  <CustomTableCell align="left">HostName</CustomTableCell>
                  <CustomTableCell align="left">Location</CustomTableCell>
                  <CustomTableCell align="left">Snap List</CustomTableCell>              
                  <CustomTableCell align="left">Status</CustomTableCell>
                  <CustomTableCell align="left">Health</CustomTableCell>
              </TableRow>
          </TableHead>
          <TableBody>
              {rows.map(row => (
              <TableRow key={row.serial}>
                  <TableCell component="th" scope="row">
                  {row.mac_address}
                  </TableCell>
                  <TableCell align="left">{row.hostname}</TableCell>
                  <TableCell align="left">{row.location}</TableCell>
                  <TableCell align="left">
                  <Tooltip title="View Snaps" placement="top-start"> 
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => {
                        this.redirectToSnap(row.serial);
                      }}
                    >
                      View
                    </Link>    
                    </Tooltip>              
                  </TableCell>
                  <TableCell align="left">
                      {row.status && (
                          <Brightness1 className={classes.active} color='primary' />
                      )}

                      {!row.status && (
                          <Brightness1 className={classes.offline} color='disabled' />
                      )}
                      
                      {row.status ? ' Active' : ' Offline'}
                  </TableCell>
                  <TableCell align="left">
                      {row.health === 'green' && (
                          <Tooltip title="View health charts" placement="top-start">
                            <Fab size="small" color="primary" aria-label="Add"
                              onClick={() => this.redirectToTarget(row.serial)}
                              className={classes.fabActive}
                              >
                              <TrendingUp/>
                            </Fab>  
                          </Tooltip>
                                            
                      )}

                      {row.health === 'red' && (
                          <Tooltip title="View health charts" placement="top-start"> 
                           <Fab size="small" color="secondary" aria-label="Edit" disabled={row.health === 'red'}
                              className={classes.fabOffline}>
                              <TrendingDown/>
                         </Fab>
                          </Tooltip>
                      )}                
                  </TableCell>
              </TableRow>
              ))}
          </TableBody>
          </Table>
              
              </div>
          </div>
      </div> 
     </div>
    )
  }
    
}

GatewayDashBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GatewayDashBoard);