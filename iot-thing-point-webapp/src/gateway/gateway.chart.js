import React, { PureComponent } from 'react';
import {
  PieChart, Pie, Sector, Cell,
} from 'recharts';

const data = [
  { name: 'Online', value: 3 },
  { name: 'Offline', value: 0 }
];
const COLORS = ['#8bc34a', '#CCC'];


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const label = data[index].name;
  const value = data[index].value;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {value} ({label})
    </text>
  );
};


export default class Example extends React.Component {

  constructor(props) {
    super(props);   
    this.state = { 
        data: [
          { name: 'Online', value: 3 },
          { name: 'Offline', value: 0 }
        ]
    }; 
  }

  render() {
    let {online, offline} = this.props;
    // if(online){
    //   data[0].value = online;
    //   data[1].value = offline;
    // }   

    return ( 
      <PieChart width={260} height={260}>
        <Pie
          data={this.state.data}
          cx={130}
          cy={130}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100} 
          fill="#8884d8"
          dataKey="value"
        >
          {
            this.state.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
      </PieChart> 
        
    );
  }
}
