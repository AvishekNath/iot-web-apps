import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GatewayDashBoard from './gateway.list';
import Typography from '@material-ui/core/Typography';

export default class GatewayManagement extends React.Component {

   constructor(props:any){
      super(props)

      // SSE Events
      let source = new EventSource("http://localhost:8080/events?topic=chart");
		source.onmessage = function(e) {
			console.log('SSE Message:', e.data);
		};
   }
   
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