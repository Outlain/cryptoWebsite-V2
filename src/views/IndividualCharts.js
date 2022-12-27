import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);
function IndividualCharts({ currentCoin, tim }) {

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        },
    };
    const dataPoints = tim.map(item => JSON.parse(item.data)[currentCoin]);


    const labels = tim.slice(-25).map(item => item.timestamp.slice(10));
    const slicedDataPoints = dataPoints.slice(-25);

    // Create chart data object
    const data = {
        labels: labels,
        datasets: [
          {
            label: currentCoin,
            data: slicedDataPoints,
            borderColor: '#3e95cd',
            backgroundColor: 'rgba(221,174,92,0.1)',
            fill: true
          }
        ]
      };

    return (
        <div className="inner-inner">
            <Line options={options} data={data} />
        </div>
    );
}





export default IndividualCharts;