import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

export default class AgGridComponent extends React.Component {
  state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Make",
          field: "make",
          sortable: true,
          filter: true
        },
        {
          headerName: "Model",
          field: "model",
          sortable: true,
          filter: true
        },
        {
          headerName: "Price",
          field: "price",
          sortable: true,
          filter: true
        }
      ],
      rowData: [
        {
          make: "Toyota",
          model: "Celica",
          price: 35000
        },
        {
          make: "Ford",
          model: "Mondeo",
          price: 32000
        },
        {
          make: "Porsche",
          model: "Boxter",
          price: 72000
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <h2> Ag Grid Component </h2>
        <div
          className="ag-theme-balham"
          style={{
            height: "300px",
            width: "600px"
          }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  }
}