import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AgGridComponent from './../../components/ag-grid/ag-grid.component';

export default class AgGridAdapterComponent extends React.Component {

   constructor(props:any){
      super(props)
   }
   
   render() {
       return (
          <div>
              <h1> Ag Grid Adapter Component</h1>
              <AgGridComponent/>
          </div>
      );
   }
}