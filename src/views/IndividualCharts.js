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


function IndividualCharts({ currentCoin, currentActiveCoinDataIndividual }) {

    try {
        // console.log(currentActiveCoinDataIndividual)


        const mostRecentDataPoint = (currentActiveCoinDataIndividual[currentActiveCoinDataIndividual.length - 1].value);

        const SecondMostRecentDataPoint = (currentActiveCoinDataIndividual[currentActiveCoinDataIndividual.length - 2].value);

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
        const dataPoints = currentActiveCoinDataIndividual.map(item => (item.value));

        // console.log(currentActiveCoinDataIndividual[0].timeStampCharting)

        const labels = currentActiveCoinDataIndividual.slice(-10).map(item => item.timeStampCharting.slice(12));
        const slicedDataPoints = dataPoints.slice(-10);


        // console.log(currentCoin)
        // console.log(labels)
        // console.log(slicedDataPoints)

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
                <div className={upDown >= 0 ? 'current green' : upDown === 0 ? 'current black' : 'current red'}>{Number.parseFloat(mostRecentDataPoint).toFixed(2)}</div>
            </div>
        );
    } catch (error) {
        // console.error(error)
        // console.error(`Still Waiting on First trade for ${currentCoin}`)
        return <div className="inner-inner-error"> Waiting for First Trade for {currentCoin} ! ....:</div>;
    }
}


export default IndividualCharts;