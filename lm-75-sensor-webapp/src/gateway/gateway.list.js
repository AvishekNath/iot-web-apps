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
    marginTop: '2em'
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
    borderRadius: '25px',
    width: '50px',
    height: '50px',
    textAlign: 'center',
    display: 'inline-block',
    paddingTop: '5px'
  },
  onlineHealth: {
    color: '#FFF',
    backgroundColor: '#8bc34a',
    borderRadius: '25px',
    width: '50px',
    height: '50px',
    textAlign: 'center',
    display: 'inline-block',
    paddingTop: '5px'
  },
  offlineHealth: {
    color: '#FFF',
    backgroundColor: '#CCC',
    borderRadius: '25px',
    width: '50px',
    height: '50px',
    textAlign: 'center',
    display: 'inline-block',
    paddingTop: '5px'
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
          sensorList: []
      };
      
      this.chartUrl = `https://us-central1-eternal-insight-234909.cloudfunctions.net/lm75-rest-endpoint`;
    }

    componentDidMount() {
      const self = this;
      axios({
        method:'get',
        url: this.chartUrl,
        params: {
          type: 'sensorinfo',
          'app_name': 'lm75'
        }
      })
     .then((response) => {
        console.log(response);
        this.setState({
          sensorList: response.data
        });
     });

      // let docRows = [];
      // let online = 0;
      // let offline = 0;
      // axios.get(`https://us-central1-avid-keel-233206.cloudfunctions.net/function-thing-point`)
      //   .then(res => {
      //     let data = res.data;    
      //     data.docRows.forEach(function(doc) {
      //       docRows.push(doc);
      //       if(doc.status === true){
      //           online+=1;
      //       }
      //       if(doc.status === false){
      //           offline+=1;
      //       }
      //     });

      //     // this.setState({
      //     //   rows: docRows,
      //     //   total: docRows.length,
      //     //   online: online,
      //     //   offline: offline
      //     // });
      // });
    }
  

    redirectToTarget(mac){
      history.push('/thing/' + mac + '/');
    }

    redirectToSnap(id){
      history.push('/thing/' + id + '/');
    }

    render(){
      const { classes } = this.props;
      const { sensorList } = this.state;

      return(        

       <div className="container"> 

        <div className="row">
          <div className="col-xs">
              <div className="card">
              <Typography variant="subheading" color="textSecondary" gutterBottom>
                Thing List
              </Typography>

              <Table className={classes.table}>
          <TableHead>
              <TableRow>
                  <CustomTableCell>Thing Name</CustomTableCell>
                  <CustomTableCell align="left">App Id</CustomTableCell>
                   <CustomTableCell align="left">Thing Point Id</CustomTableCell>
                  <CustomTableCell align="left">Version</CustomTableCell>
                  <CustomTableCell align="left">Metric</CustomTableCell>
              </TableRow>
          </TableHead>
          <TableBody>
              {sensorList.map(row => (
              <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                  {row.sensor_name}
                  </TableCell>
                  <TableCell align="left">{row.app_id}</TableCell> 
                  <TableCell align="left">
                    {row.tp_id}            
                  </TableCell>
                  <TableCell align="left">                      
                    {row.version }
                  </TableCell>
                  <TableCell align="left">

                          <Tooltip title="View health charts" placement="top-start">
                            <Fab size="small" color="primary" aria-label="Add"
                              onClick={() => this.redirectToTarget(row.app_id)}
                              className={classes.fabActive}
                              >
                              <TrendingUp/>
                            </Fab>  
                          </Tooltip>
                      {/* {row.health === 1 && (
                          <Tooltip title="View health charts" placement="top-start">
                            <Fab size="small" color="primary" aria-label="Add"
                              onClick={() => this.redirectToTarget(row.id)}
                              className={classes.fabActive}
                              >
                              <TrendingUp/>
                            </Fab>  
                          </Tooltip>
                                            
                      )}

                      {row.health === 2 && (
                          <Tooltip title="View health charts" placement="top-start"> 
                           <Fab size="small" color="secondary" aria-label="Edit" onClick={() => this.redirectToTarget(row.mac)}
                              className={classes.fabOffline}>
                              <TrendingDown/>
                         </Fab>
                          </Tooltip>
                      )}                 */}
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