import { React, useState, useEffect } from 'react'
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Filler,
//     Legend
// );


function TopTradedChart({ coinData }) {
    const [percentObject, setPercentObject] = useState({})

    useEffect(() => {
        console.log(coinData)
        console.log(percentObject)
    }, [coinData])


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

    useEffect(() => {
        setPercentObject(convertToPercentChange(coinData));
    }, [coinData])

    try {
        // throw new Error('Debugging error');  // manually throw an error



        return (
            <div className="inner-inner-first"></div>
        );
    } catch (error) {

        return (
            <div className="inner-inner-first">Loading ..... </div>
        );
    }
}

export default TopTradedChart;
