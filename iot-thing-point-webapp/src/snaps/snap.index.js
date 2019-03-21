import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SnapDashBoard from './snap.list';
import Typography from '@material-ui/core/Typography';

export default class SnapManagement extends React.Component {
    render() {
       return (
          <div>
               <Typography variant="h6" color="textSecondary" gutterBottom>
                  Snap List
               </Typography>
               <hr className="hr-line"/>
             <SnapDashBoard/>
          </div>
       );
    }
 }