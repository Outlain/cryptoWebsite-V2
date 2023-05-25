import React, { useEffect, useState } from 'react';
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

function TopTradedChart({ coinData }) {
    const [percentObject, setPercentObject] = useState([]);

    useEffect(() => {
        setPercentObject(convertToPercentChange(coinData));
        console.log(percentObject)
    }, [coinData]);

    function convertToPercentChange(data) {
        return data.map(coin => {
            const baseline = parseFloat(coin.data[0].value);
            const newData = coin.data.map(point => ({
                ...point,
                value: ((parseFloat(point.value) - baseline) / baseline) * 100,
            }));
            return { ...coin, data: newData };
        });
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            }
        },
    };

    // Assumption: all coin data arrays have the same number of elements
    const labels = percentObject[0]?.data.map(item => item.timeStampCharting.slice(10)) || [];

    const data = {
        labels: labels,
        datasets: percentObject.map((coin, index) => ({
            label: coin.coinName.charAt(0).toUpperCase() + coin.coinName.slice(1),
            data: coin.data.map(item => item.value),
            borderColor: `hsl(${index * 90}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 90}, 70%, 50%, 0.2)`,
            fill: true
        }))
    };

    return (
        <div className="inner-inner-first">
            <Line options={options} data={data} height="100%" width="100%" />
        </div>
    );
}

export default TopTradedChart;
