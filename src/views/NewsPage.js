import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import { Chart } from "react-google-charts";
import Navigation from "./Navigation.js";

const FearAndGreedIndex = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const handleNavToggle = (newValue) => {
        setIsNavOpen(newValue);
    };
    const [indexData, setIndexData] = useState(null);
    const [chartData, setChartData] = useState([["Date", "Fear & Greed"]]);
    const [dataAmount, setDataAmount] = useState(180);
    const [currentDataAmountSelection, setCurrentDataAmountSelection] =
        useState("One Month");
    const [currentDay, setCurrentDay] = useState(0);
    const [selectedCurrentDay, setSelectedCurrentDay] = useState(0);
    const [currentTimeTill, setCurrentTimeTill] = useState(0);
    const [activeCountDown, setActiveCountdown] = useState(true);
    const countdownInterval = useRef();
    const [once, setOnce] = useState(true);

    useEffect(() => {
        const optionsBackUp = {
            method: "GET",
            url: `https://api.alternative.me/fng/?limit=${dataAmount}`,
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
            },
        });

        axios
            .request(optionsBackUp)
            .then(function (response) {
                setIndexData(response.data.data);

                // Transform data for chart and update state
                const chartData = response.data.data.map((datum) => {
                    const date = new Date(datum.timestamp * 1000).toLocaleDateString();
                    const value = Number(datum.value);
                    return [date, value];
                });

                // Add column names to chartData
                chartData.unshift(["Date", ""]);
                setChartData(chartData);
            })
            .catch(function (errorBackup) {
                console.error(errorBackup);
            });
    }, [dataAmount]);

    const handleChange = (event, string) => {
        if (string === "multiple") {
            setCurrentDataAmountSelection(event.target.value);
        }
        if (string === "single") {
            setSelectedCurrentDay(event.target.value);
        }
    };
    const handleSubmit = (event, string) => {
        if (string === "multiple") {
            setDataAmount(currentDataAmountSelection);
        }
        if (string === "single") {
            setCurrentDay(selectedCurrentDay);
            if (selectedCurrentDay === 0) {
            }
        }
    };

    useEffect(() => {
        if (Number(currentDay) === 0 && indexData && once) {
            setCurrentTimeTill(indexData[0].time_until_update);
            setOnce(false)
        }
    }, [currentDay, indexData, once]);

    useEffect(() => {
        if (activeCountDown && countdownInterval && currentDay === 0) {
            let inter = 0
            countdownInterval.current = setInterval(() => {
                setCurrentTimeTill((prevTime) => prevTime - 1);
                inter++;
                console.log(inter);
            }, 1000);
            setActiveCountdown(false)
        }
    }, [activeCountDown, currentDay]);


    return (
        <div className="news">
            <Navigation isNavOpen={isNavOpen} onToggle={handleNavToggle} />

            <div className="news-top">
                {indexData ? (
                    <div className="fear-greed">
                        {Number(currentDay) === 0 ? (
                            <h2> Todays Fear and Greed Index</h2>
                        ) : (
                            <h2> Fear and Greed Index from {currentDay} ago </h2>
                        )}
                        <Chart
                            chartType="Gauge"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ["Label", "Value"],
                                ["Fear & Greed", Number(indexData[currentDay].value)],
                            ]}
                            options={{
                                redFrom: 0,
                                redTo: 25,
                                yellowFrom: 25,
                                yellowTo: 75,
                                greenFrom: 75,
                                greenTo: 100,
                                minorTicks: 6,
                            }}
                            rootProps={{ "data-testid": "1" }}
                        />
                        <p>
                            Value Classification: {indexData[currentDay].value_classification}
                        </p>
                        <p>
                            Date:{" "}
                            {new Date(
                                indexData[currentDay].timestamp * 1000
                            ).toLocaleDateString()}
                        </p>
                        {Number(currentDay) === 0 ? (
                            <p>
                                Time until next update:
                                {` 
      ${Math.floor((currentTimeTill % (24 * 60 * 60)) / (60 * 60))} hours, 
      ${Math.floor((currentTimeTill % (60 * 60)) / 60)} minutes, 
      ${currentTimeTill % 60} seconds`}
                            </p>
                        ) : (
                            <div></div>
                        )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                <div className="news-top-right">
                    <h5>
                        Select the TimeFrame of data you would like to see and manipulate,
                        then select the number days you would like to view individualy
                        charted from the timeframe
                    </h5>
                    <div className="data-button data-day-button">
                        <select
                            value={currentDataAmountSelection}
                            onChange={(event) => handleChange(event, "multiple")}
                        >
                            <option value="7">One Week</option>
                            <option value="12">One Month</option>
                            <option value="180">Six Months</option>
                            <option value="365">One Year</option>
                        </select>

                        <button onClick={(event) => handleSubmit(event, "multiple")}>
                            TimeFrame
                        </button>
                    </div>
                    <div className="data-button data-chart-button">
                        <select
                            value={selectedCurrentDay}
                            onChange={(event) => handleChange(event, "single")}
                        >
                            {indexData ? (
                                indexData.map((value, index) => {
                                    return (
                                        <option key={index} value={index}>
                                            {index === 0
                                                ? "today"
                                                : index === 1
                                                    ? 1 + " day ago"
                                                    : index + " days ago"}
                                        </option>
                                    );
                                })
                            ) : (
                                <div>Loading...</div>
                            )}
                        </select>
                        <button onClick={(event) => handleSubmit(event, "single")}>
                            Day
                        </button>
                    </div>
                </div>
            </div>
            <div className="news-bottom">
                <div className="news-line-chart">
                    {chartData.length > 1 && (
                        <Chart
                            chartType="Line"
                            loader={<div>Loading Chart</div>}
                            data={chartData}
                            options={{
                                chart: {
                                    title:
                                        `Fear & Greed Index over the Last ` + dataAmount + ` Days`,
                                },
                            }}
                            rootProps={{ "data-testid": "2" }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FearAndGreedIndex;
