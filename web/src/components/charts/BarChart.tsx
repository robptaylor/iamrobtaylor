// components/BarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartData } from "chart.js";

interface Props {
  chartData: ChartData<'bar'>
  title: string
  chartClassName: string
  yTitle?: {
    text: string;
    display: boolean;
    align: 'center' | 'start' | 'end';
  }
}

function BarChart(props: Props) {
  return (
    <div className={props.chartClassName}>
      <Bar
        data={props.chartData}
        options={{
          plugins: {
            legend: {
              display: true,
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
              max: 100,
              stacked: true,
              title: props.yTitle
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