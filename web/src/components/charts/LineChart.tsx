import React from "react";
import { Line } from "react-chartjs-2";
import { ChartData, LegendOptions } from "chart.js";

interface Props {
  chartData: ChartData<'line'>
  title: string
  chartClassName: string
  minY?: number
  displayLegend?: boolean
  yTitle?: {
    text: string;
    display: boolean;
    align: 'center' | 'start' | 'end';
  }
}

function LineChart(props: Props) {
  return (
    <div className={props.chartClassName}>
      <Line
        data={props.chartData}
        options={{
          plugins: {
            legend: {
              display: props.displayLegend ?? true,
              position: 'bottom'
            },
            title: {
              display: true,
              text: props.title,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              min: props.minY,
              title: props.yTitle
            },
            x: {},
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
export default LineChart;