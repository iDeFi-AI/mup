import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
}

export const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} />;
};
