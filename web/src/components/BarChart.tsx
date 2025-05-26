// components/BarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import './BarChart.css'
import { ChartData } from "chart.js";

interface Props {
  chartData: ChartData<'bar'>
  title: string
  chartClassName: string
}

function BarChart(props: Props) {
  return (
    <div className={props.chartClassName}>
      <div className="chart-title">{props.title}</div>
      <Bar
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
              max: 100,
              stacked: true
            },
            x: {
              stacked: true,

            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}
export default BarChart;