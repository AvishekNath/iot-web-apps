import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import GatewayHealthChart from './heath.chart';
import { Settings } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
   root: {
     marginTop: theme.spacing.unit * 3,
     overflowX: 'auto',
     padding: '1em'
   },
   paper: {
     position: 'absolute',
     width: theme.spacing.unit * 100,
     backgroundColor: theme.palette.background.paper,
     boxShadow: theme.shadows[5],
     padding: theme.spacing.unit * 4,
     outline: 'none',
     height: theme.spacing.unit * 35
   },
   closeBtn: {
     position: 'absolute',
     right: '2em',
     bottom: '2em'
   },
   container: {
      display: 'flex',
      flexWrap: 'wrap',
   },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
   },
    dense: {
      marginTop: 16,
   },
    menu: {
      width: 200,
   }
 });


function getModalStyle() {
   const top = 50;
   const left = 50;
 
   return {
     top: `${top}%`,
     left: `${left}%`,
     transform: `translate(-${top}%, -${left}%)`,
   };
}
 
class GatewayHealth extends React.Component {

   constructor(props) {
      super(props);   
      this.state = { 
         open: false,
         temperature: '50',
         usage: '50',
         memory: '70'
      }; 

      this.tpId = '';
      
      if(this.props.match){
         this.tpId = this.props.match.params.id;
      }
  } 

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

   openSettingMenu = () => {
      console.log('open setting');
   };

   handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };

    render(){

      const { classes } = this.props;
      return (
          <div>
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
                    Chart Threshold Settings
                  </Typography>
                  <hr/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs">

                     <form className={classes.container} noValidate autoComplete="off">
                     <TextField
                           id="outlined-name"
                           label="CPU usage"
                           className={classes.textField}
                           value={this.state.usage}
                           onChange={this.handleChange('usage')}
                           margin="normal"
                           variant="outlined"
                        />
                        
                        <TextField
                           id="outlined-name"
                           label="CPU temperature"
                           className={classes.textField}
                           value={this.state.temperature}
                           onChange={this.handleChange('temperature')}
                           margin="normal"
                           variant="outlined"
                        /> 

                        <TextField
                           id="outlined-name"
                           label="Memory Usage"
                           className={classes.textField}
                           value={this.state.memory}
                           onChange={this.handleChange('memory')}
                           margin="normal"
                           variant="outlined"
                        /> 
                     </form>
                  </div>
                </div>

                <div className="row bottom-xs">
                    <div className="col-xs">                       
                        <Button 
                          className={classes.closeBtn} 
                          variant="contained" 
                          color="secondary"
                          onClick={this.handleClose}
                        >
                          Save
                        </Button>  
                    </div>
                </div> 
                  {/* <SimpleModalWrapped /> */}
                </div>
              </Modal>
             <div className="row">
               <div className="col-xs-10">
               <Typography variant="h6" color="textSecondary" gutterBottom>
                  Thing Health
               </Typography>
               </div>

               <div className="col-xs-2 end-xs">
                  <IconButton color="inherit"
                  aria-haspopup="true"
                  color="inherit" 
                  onClick={this.handleOpen}
               >
                  <Settings/>
               </IconButton>
               </div>

             </div> 

            <hr className="hr-line"/>
            <GatewayHealthChart tpId={this.tpId}/>
          </div>
       );
    }
}


GatewayHealth.propTypes = {
   classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(GatewayHealth);

