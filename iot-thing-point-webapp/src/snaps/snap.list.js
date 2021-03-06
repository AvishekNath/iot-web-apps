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
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {WbCloudy, RotateRight, Cancel, Delete} from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';
import { TrendingUp, TrendingDown } from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '1em'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 135,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    height: theme.spacing.unit * 50
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
    color: '#eeeeee'
  },
  health: {
      good: {
        color: '#32CD32',
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
    backgroundColor: '#2196f3'
  },
  onlineHealth: {
    color: '#FFF',
    backgroundColor: '#8bc34a'
  },
  offlineHealth: {
    color: '#FFF',
    backgroundColor: '#607d8b'
  },
  list: {
    marginTop: '2em'
  },
  fab: {
    backgroundColor: '#FF0000'
  },
  addSnaps: {
    float: 'right',
    backgroundColor: '#2196f3'
  },
  snapCard: {
    backgroundColor: '#efefef',
    marginBottom: '1em'
  },
  installBtn: {
    float: 'right',
    diplay: 'flex',
    align: 'right'
  },
  closeBtn: {
    position: 'absolute',
    right: '2em',
    bottom: '2em'
  },
  status: {
    cursor: 'default',
    width: '80px',
    display: 'inline-block',
    position: 'relative',
    top:'-5px',
    padding:'5px 10px',
    color: '#90a4ae'
  },
  rowContainer: {
    height: '220px',
    overflowY: 'scroll',
    padding: '1em'
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
function createData(name, version, rev, tracking, developer, notes, status) {
  id += 1;
  id += Math.floor(Math.random() * 1000);
  return { id, name, version, rev, tracking, developer, notes, status};
}

const rows = [
  createData('httplab', '5.47-3', 167, 'beta' , 'canonical', 'devmode', 'Installed'),
  createData('ble', '5.47-3', 167, 'beta' , 'canonical', 'devmode', 'Installed'),
  createData('pubnub', '5.47-3', 167, 'beta' , 'canonical', 'devmode', 'Installed')
];

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
 
class SnapDashBoard extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);   
        this.state = { 
            snapData: [],
            open: false,
            addSnapData: []
        }; 
    } 

    handleOpen = () => {
      this.setState({ open: true });
      this.listSnap();
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };  

    deleteSnap = (row) => {
      console.log(row);
      let rows = this.state.snapData;
      let newSnapData = rows.map((obj) => {
        if(row.name === obj.name){
          return Object.assign(obj, {del_enable: false});
        }
        return obj;
      });

      this.setState({snapData: newSnapData});

      // Delete Snap
      let url = 'https://us-central1-eternal-insight-234909.cloudfunctions.net/visibility-server?type=deletesnap';
      axios({
        method:'get',
        url: url,
        params: {
          'serial': this.props.serial,
          'name': row.name   
        }
      })
      .then(res => {
        let data = res.data;    
        console.log(data);
        this.getSnapList(row, 'Deleting');
      });
    };
    // Add Snap
    addSnap = (snapObj = {}) => {

      let addedSnapData = this.state.addSnapData.slice(0);
      addedSnapData.forEach(obj => {
        if(obj.serial === snapObj.serial){
          obj.clicked = true;
        }
      });

      this.setState({ addSnapData: addedSnapData });
      let url = 'https://us-central1-eternal-insight-234909.cloudfunctions.net/visibility-server?type=addsnap';
      axios({
        method:'get',
        url: url,
        params: {
          'serial': this.props.serial,
          'name': snapObj.name   
        }
      })
      .then(res => {
        let data = res.data;    
        console.log('Add Snap', data); 
        this.getSnapList(snapObj, 'Installing'); // Enable http polling
      });
      
    };

    // List Snap
    listSnap = (snapObj = {}) => {      
      let url = 'https://us-central1-eternal-insight-234909.cloudfunctions.net/visibility-server?type=snapstorelist';
      axios({
        method:'get',
        url: url,
        params: {
          'serial': this.props.serial
        }
      })
      .then(res => {
        let data = res.data;
        data.clicked = false;    
        this.setState({ addSnapData: data });
        console.log('List Snap', data); 
      });
    };


    getList = (snapObj, action) =>{
      let url = 'https://us-central1-eternal-insight-234909.cloudfunctions.net/visibility-server?type=snapbundleinfo&serial=' + this.props.serial;
      
      axios.get(url)
        .then(res => {
          let data = res.data;   
          if (this._isMounted) { 
            this.setState({
              snapData: data
            });
          }
      });
    };

    getSnapList = (snapObj, action) => { 

      if(action){
        this.getList(snapObj, action);

        // repeat with the interval of 10 seconds
        let timerId = setInterval(() => {

          if(action.toLowerCase() === 'deleting'){
            var found = this.state.snapData.find(function(data) {
              return data.name === snapObj.name;
            });  
            if(!found){
              clearInterval(timerId);
              console.log('pooling intermittently stopped ');
            }  
            
          }else if(action.toLowerCase() === 'installing'){         
            let filterInstalled = this.state.snapData.filter((obj) => {
              return (obj.name === snapObj.name && (obj.status.toLowerCase() === 'installed' || obj.status.toLowerCase() === 'failed'));
            });  
            if(filterInstalled.length > 0){
              clearInterval(timerId);
              console.log('pooling intermittently stopped');
            }
          }

          this.getList(snapObj, action);

        }, 10000); 

        // after 120 seconds stop
        setTimeout(() => { clearInterval(timerId); console.log('pooling stopped'); }, 120000);

      }else{
        this.getList();
      }
    };

    componentDidMount(){
      this._isMounted = true;
      this.getSnapList();
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    render(){
      const { classes, serial } = this.props;
      const { snapData, addSnapData} = this.state;

      return(        

       <div className="container">
        <div className="row">
          <div className="col-xs">
              <div className="card">

              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
                disableBackdropClick={false}
                style={{alignItems:'center',justifyContent:'center'}}
              >
                <div style={getModalStyle()} className={classes.paper}>

                <div className="row">
                  <div className="col-xs">
                  <Typography gutterBottom variant="h5" component="h2">
                    Add Snaps
                  </Typography>
                  <hr/>
                  </div>
                </div>

                <div className={classes.rowContainer + ' row'} >

                    {addSnapData.map(snap => (
                      <div key={snap.serial} className="col-xs-3">
                        <Card className={snap.clicked === true ? classes.snapCard + ' disable-card' :  classes.snapCard}>
                          <CardActionArea>                    
                            <CardContent>
                              <Typography gutterBottom variant="subheading" component="h2">
                                {snap.name}
                              </Typography>
                              <hr/>
                              Version: {snap.version}
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Button disabled={snap.clicked === true || snap.status !== 'install'} onClick={this.addSnap.bind(this, snap)} className={classes.installBtn} variant="contained" size="small" color="primary">
                              Install
                            </Button> 
                          </CardActions>
                        </Card>
                      </div>                
                    ))}      
                </div>

                <div className="row bottom-xs">
                    <div className="col-xs">                       
                        <Button 
                          className={classes.closeBtn} 
                          variant="contained" 
                          color="secondary"
                          onClick={this.handleClose}
                        >
                          Close
                        </Button>  
                    </div>
                </div>
                  
                  {/* <SimpleModalWrapped /> */}
                </div>
              </Modal>

              <Button size="small" variant="contained" color="primary" className={classes.addSnaps} 
              onClick={this.handleOpen}>
                Add Snaps
              </Button>
              <Typography variant="subheading" color="textSecondary" gutterBottom>
                List of Snaps
              </Typography> 

              <Table className={classes.table}>
          <TableHead>
              <TableRow>
                  <CustomTableCell align="left">Name</CustomTableCell>    
                  <CustomTableCell align="left">Version</CustomTableCell>    
                  <CustomTableCell align="left">Revision</CustomTableCell>           
                  <CustomTableCell align="left">Channel</CustomTableCell>              
                  {/* <CustomTableCell align="left">Dev Mode</CustomTableCell> */}
                  <CustomTableCell align="left">Action</CustomTableCell>
                  <CustomTableCell align="left">Status</CustomTableCell>

              </TableRow>
          </TableHead>
          <TableBody>
              {snapData.map(row => (
              <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                  {row.name}
                  </TableCell>
                  <TableCell align="left">{row.version}</TableCell>
                  <TableCell align="left">{row.revision}</TableCell>
                  <TableCell align="left">
                  {row.channel !== '' ? row.channel : 'N/A'}</TableCell>
               
                  {/* <TableCell align="left">
                      {row.devmode && (
                          <Brightness1 className={classes.active} color='primary' />
                      )}

                      {!row.devmode && (
                          <Brightness1 className={classes.offline} color='disabled' />
                      )} 
                      
                      {row.devmode ? ' YES' : ' NO'}
                  </TableCell> */}
                  
                  <TableCell align="left">
                    <div>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="secondary"
                        disabled={(row.status === 'Deleting' || row.status === 'Installing') || !row.del_enable}
                        onClick={this.deleteSnap.bind(this, row)}
                      >
                        Delete 
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell align="left">
                    {row.status === 'Installing' && (
                      <RotateRight className="rotation"/>
                    )}

                    {row.status === 'Installed' && (
                      <WbCloudy/>
                    )}

                    {row.status === 'Failed' && (
                      <Cancel/>
                    )}

                    {row.status === 'Deleting' && (
                      <RotateRight className="rotation"/>
                    )}

                    <div className={classes.status}>
                      {row.status} 
                    </div>
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

SnapDashBoard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SimpleModalWrapped = withStyles(styles)(SnapDashBoard);

export default withStyles(styles)(SnapDashBoard);