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

    try {
        const mostRecentDataPoint = JSON.parse(tim[tim.length - 1].data)[currentCoin];

        const SecondMostRecentDataPoint = JSON.parse(tim[tim.length - 2].data)[currentCoin];

        var upDown = mostRecentDataPoint - SecondMostRecentDataPoint

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
        var upDownBorderColor = 'rgba(225,0,0)'
        var upDownBackgroundColor = 'rgba(225,0,0,0.2)'

        if (upDown < 0) {
            upDownBorderColor = 'rgba(225,0,0)'
            upDownBackgroundColor = 'rgba(225,0,0,0.2)'

        } else if (upDown === 0) {
            upDownBorderColor = 'rgba(0,255,0)'
            upDownBackgroundColor = 'rgba(0,255,0, 0.2)'


        } else {
            upDownBorderColor = 'rgba(0,128,0)'
            upDownBackgroundColor = 'rgba(0,128,0,0.2)'
        }



        const data = {
            labels: labels,
            datasets: [
                {
                    label: currentCoin.charAt(0).toUpperCase() + currentCoin.slice(1),
                    data: slicedDataPoints,
                    borderColor: upDownBorderColor,
                    backgroundColor: upDownBackgroundColor,
                    fill: true
                }
            ]
        };


        return (
            <div className="inner-inner">
                <div className='chart'><Line options={options} data={data} height="100%" /></div>
                <div className={upDown >= 0 ? 'current green' : upDown === 0 ? 'current black' : 'current red'}>{mostRecentDataPoint}</div>
            </div>
        );
    } catch (error) {
        console.error(`Still Waiting on First trade for ${currentCoin}`)
        return <div className="inner-inner-error"> Waiting for First Trade for {currentCoin} ! ....:</div>;
    }
}


export default IndividualCharts;