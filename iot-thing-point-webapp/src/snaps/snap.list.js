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
    backgroundColor: '#efefef'
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
    width: '100px'
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
      let filteredRows = rows.filter((obj) => {
        return obj.name !== row.name;
      });

      // Delete Snap
      let url = 'https://us-central1-sage-buttress-230707.cloudfunctions.net/Visibility-server?type=deletesnap';
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
        this.getSnapList();
      });
    };
    // Add Snap
    addSnap = (snapObj = {}) => {
      let url = ' https://us-central1-sage-buttress-230707.cloudfunctions.net/Visibility-server?type=addsnap';
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
        this.getSnapList();
      });
      
    };

    // List Snap
    listSnap = (snapObj = {}) => {      
      let url = 'https://us-central1-sage-buttress-230707.cloudfunctions.net/Visibility-server?type=snapstorelist';
      axios({
        method:'get',
        url: url,
        params: {
          'serial': this.props.serial
        }
      })
      .then(res => {
        let data = res.data;    
        this.setState({ addSnapData: data });
        console.log('List Snap', data); 
      });
      
    };

    getSnapList = () => {
      let url = 'https://us-central1-sage-buttress-230707.cloudfunctions.net/Visibility-server?type=snapbundleinfo&serial=' + this.props.serial;
      axios.get(url)
        .then(res => {
          let data = res.data;    
          this.setState({
            snapData: data
          });
      });
    };

    componentDidMount(){
      this.getSnapList();
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

                <div className="row">

                    {addSnapData.map(snap => (
                      <div key={snap.serial} className="col-xs">
                        <Card className={classes.snapCard}>
                          <CardActionArea>                    
                            <CardContent>
                              <Typography gutterBottom variant="h6" component="h2">
                                {snap.name}
                              </Typography>
                              <hr/>
                              ver. {snap.version}
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Button disabled={snap.status !== 'install'} onClick={this.addSnap.bind(this, snap)} className={classes.installBtn} variant="contained" size="small" color="primary">
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
                  <CustomTableCell align="left">Rev</CustomTableCell>           
                  <CustomTableCell align="left">Channel</CustomTableCell>              
                  <CustomTableCell align="left">Dev Mode</CustomTableCell>
                  <CustomTableCell align="left">Action</CustomTableCell>
                  <CustomTableCell align="left">Current Status</CustomTableCell>

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
               
                  <TableCell align="left">
                      {row.devmode && (
                          <Brightness1 className={classes.active} color='primary' />
                      )}

                      {!row.devmode && (
                          <Brightness1 className={classes.offline} color='disabled' />
                      )} 
                      
                      {row.devmode ? ' YES' : ' NO'}
                  </TableCell>

                  <TableCell align="left">
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="secondary"
                      disabled={!row.del_enable}
                      onClick={this.deleteSnap.bind(this, row)}
                    >
                      Delete 
                    </Button>
                  </TableCell>

                  <TableCell align="left">
                  <Button size="small" variant="outlined" color="primary" className={classes.status}>
                    {row.status} 
                  </Button>
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