import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GatewayDashBoard from './gateway.list';
import Typography from '@material-ui/core/Typography';

export default class GatewayManagement extends React.Component {
    render() {
       return (
          <div>
               {/* <Typography variant="h6" color="textSecondary" gutterBottom>
                  TP(Thing Point) DashBoard
               </Typography>
               <hr className="hr-line"/> */}
             <GatewayDashBoard/>
          </div>
       );
    }
 }