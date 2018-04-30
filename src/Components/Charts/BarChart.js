import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data }) => (
  <Bar
    data={data}
    width={100}
    height={100}
    options={{
      maintainAspectRatio: false,
    }}
  />
)

export default BarChart;
