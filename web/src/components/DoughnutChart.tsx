import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  chartData: ChartData<'doughnut'>
  title: string
  chartClassName: string
}

function DoughnutChart(props: Props) {
  return (
    <div className={props.chartClassName}>
      <Doughnut
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
          responsive: true,
          maintainAspectRatio: false
        }
      }
      />
    </div>
  );
}
export default DoughnutChart;