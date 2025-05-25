import React from "react";
import { Line } from "react-chartjs-2";
import { ChartData } from "chart.js";

interface Props {
  chartData: ChartData<'line'>
  title: string
  chartClassName: string
}

function LineChart(props: Props) {
  return (
    <div className={props.chartClassName}>
      <div className="chart-title">{props.title}</div>
      <Line
        data={props.chartData}
        options={{
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
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