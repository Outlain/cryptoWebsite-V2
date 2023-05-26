import React, { useState, useEffect } from "react";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Chart } from "react-google-charts";


const FearAndGreedIndex = () => {
    const [indexData, setIndexData] = useState(null);

    useEffect(() => {
        const optionsBackUp = {
            method: 'GET',
            url: 'https://api.alternative.me/fng/?limit=1',
        };

        axiosRetry(axios, {
            retries: 10,
            retryDelay: (retryCount) => {
                // For the first 5 retries, the delay is a constant 0.5s.
                // For the next 5 retries, the delay increases by 1s per attempt, starting at 1s.
                // For the final 5 retries, the delay is a constant 5s.
                if (retryCount <= 5) {
                    return 500;
                } else if (retryCount <= 10) {
                    return (retryCount - 5) * 1000;
                } else {
                    return 5000;
                }
            }
        });

        axios.request(optionsBackUp).then(function (response) {
            setIndexData(response.data.data[0])
        }).catch(function (errorBackup) {
            console.error(errorBackup)
        })
    }, []);

    return (
        <div className="news">
            <div className="news-top">
                {indexData ? (
                    <div className="fear-greed">
                        <h2>Bitcoin Fear and Greed Index</h2>
                        <Chart
                            width={'25vw'}
                            height={'30vh'}
                            chartType="Gauge"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Label', 'Value'],
                                ['Fear & Greed', Number(indexData.value)],
                            ]}
                            options={{
                                redFrom: 0, redTo: 25,
                                yellowFrom: 25, yellowTo: 75,
                                greenFrom: 75, greenTo: 100,
                                minorTicks: 6,
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                        <p>Value: {indexData.value}</p>
                        <p>Value Classification: {indexData.value_classification}</p>
                        <p>Date: {new Date(indexData.timestamp * 1000).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="news-bottom">
                <div></div>
            </div>

        </div>
    );
};

export default FearAndGreedIndex;
