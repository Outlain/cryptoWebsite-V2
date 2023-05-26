import { React, useState, useEffect, useRef, Suspense, lazy } from 'react'

import Navigation from './Navigation.js';
const IndividualCharts = lazy(() => import('./IndividualCharts'));
const TopTradedChart = lazy(() => import('./TopTradedChart.js'));

function ChartsPage() {

    const [isNavOpen, setIsNavOpen] = useState(false);
    const handleNavToggle = (newValue) => {
        setIsNavOpen(newValue);
    }
    const [isIdle, setIsIdle] = useState(false);
    const intervalRef = useRef(null);
    const handleIdleChange = (isIdlPprop) => {
        setIsIdle(isIdlPprop);
    };


    const webSocketRef = useRef(null);
    const [messageArray, setMessageArray] = useState([]);
    const [uniqueCoinNames, setUniqueCoinNames] = useState([]);
    const [currentActiveCoinsList, setCurrentActiveCoinsList] = useState([]);
    const [currentActiveCoinData, setCurrentActiveCoinsData] = useState([]);
    const [currentDeleting, setCurrentDeleting] = useState([]);
    const [topActiveCoinData, setTopActiveCoinData] = useState([]);
    const [isWebSocketActive, setWebSocketActive] = useState(false);

    // useEffect(() => {
    // console.log('messageArray')
    // console.log(messageArray)
    // console.log('uniqueCoinNames')
    // console.log(uniqueCoinNames)
    // console.log('currentActiveCoinsList')
    // console.log(currentActiveCoinsList)
    // console.log('currentActiveCoinData')
    // console.log('currentDeleting')
    // console.log(currentDeleting)

    // }, [messageArray, uniqueCoinNames, currentActiveCoinsList, currentActiveCoinData, currentDeleting]);

    const openingWebsocketLogic = () => {
        webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=ALL`);

        webSocketRef.onerror = (event) => {
            // Handle possible websockeet errors 
            console.error(event);
            console.error('There is somethiing wrong when setting up a connection to the real time data!!')
        };
        // Handleling what happens on each message the Websocket sends
        webSocketRef.current.onmessage = function (msg) {
            // Getting Current time so that each message will have a timestamp
            const timeStampObjectData = new Date()
            // Getting the timestamp for the Chart 
            const timeStampCharting = `${timeStampObjectData.toLocaleDateString()} ${timeStampObjectData.toLocaleTimeString()}`;
            // Combining the Websocket date with the timestamp and formated timestamp for the charting
            const dataWithTimestamp = { data: msg.data, timeStampObject: timeStampObjectData, timeStampCharting: timeStampCharting };
            // Adding the current Message Data with both timestamps to the previous Message Array
            setMessageArray((PreviousMessageArray) => {
                let updatedMessageArray = [...PreviousMessageArray, dataWithTimestamp];
                if (updatedMessageArray.length > 100) { // Keep only the last 100 data points
                    updatedMessageArray = updatedMessageArray.slice(1); // This removes the oldest data point
                }
                return updatedMessageArray;
            });
            // console.log(msg.data)
        }
    }

    useEffect(() => {
        // Checking if the websocket is active before starting the websocket connection
        if (!webSocketRef.current) {
            openingWebsocketLogic();
        }
        document.addEventListener('visibilitychange', () => {
            handleIdleChange(document.hidden);
        });
        // Setting Interval that will update a vaiable based on websocket connection and use this later to update connection button
        const interval = setInterval(() => {
            if (webSocketRef.current) {
                setWebSocketActive(webSocketRef.current.readyState <= 1);
            }
        }, 1000); // Check every second

        return () => {
            clearInterval(interval);

            // close the WebSocket connection when the component unmounts
            try {
                document.removeEventListener('visibilitychange', () => {
                    handleIdleChange(document.hidden);
                });
                webSocketRef.current.close(1000, 'Closing the connection');
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    useEffect(() => {
        try {
            // if (webSocketRef.current.readyState === WebSocket.CLOSED || !webSocketRef.current) {
            //     openingWebsocketLogic()
            // }
            if (webSocketRef.current.readyState === WebSocket.OPEN) {

                function getUniqueCoinNames(data) {
                    // Create an empty object to store the unique coin names and their counts
                    const uniqueCoinNamesObject = {};

                    // Iterate through the array of objects
                    for (const datum of data) {
                        // Parse the data field into a JavaScript object
                        const coinOnlyData = JSON.parse(datum.data);
                        const coinDateObjectUnix = datum.timeStampObject.getTime()

                        // Get the keys of the coinOnlyData object (these are the coin names)
                        const onlyCoinNames = Object.keys(coinOnlyData);

                        // Get the current timestamp
                        const currentTimestampUnix = new Date().getTime();

                        // Iterate through the coin names
                        for (const coinName of onlyCoinNames) {
                            // Check if the coin name is already present in the uniqueCoinNamesObject object
                            if (coinName in uniqueCoinNamesObject) {
                                // Check if the coin has been added within the past 30 seconds
                                if (currentTimestampUnix - coinDateObjectUnix < 30000) {
                                    // Increment the count for the coin
                                    uniqueCoinNamesObject[coinName].cacheCount++;
                                } else {
                                    // Reset the count for the coin
                                    uniqueCoinNamesObject[coinName].cacheCount = 1;
                                }
                                // Increment the total count for the coin (this is differnt from the cache count as that count resets every 30 seconds and this one never resets)
                                uniqueCoinNamesObject[coinName].totalCount++;
                            } else {
                                // If the current coin is not already in the coin object then add the coin to the uniqueCoinNamesObject object with a count of 1 and a total count of 1
                                uniqueCoinNamesObject[coinName] = { cacheCount: 1, totalCount: 1 };
                            }
                        }
                    }

                    // Changes the format from a gaint object withe the object keys being the coin name with cache count and total count into a new giant Array of obejcts each with a value for the coin name cahcec ount and total count respectavely to make the data easier to work with
                    let uniqueCoinNamesObjectArray = Object.entries(uniqueCoinNamesObject).map(([coinName, { cacheCount, totalCount }]) => ({ coinName, cacheCount, totalCount }));

                    // Sort the array by the count in descending order
                    uniqueCoinNamesObjectArray.sort((a, b) => b.cacheCount - a.cacheCount);
                    // Getting rid of anything past 38 coins
                    uniqueCoinNamesObjectArray = uniqueCoinNamesObjectArray.slice(0, 38)
                    // Return the sorted array
                    return uniqueCoinNamesObjectArray;
                }

                setUniqueCoinNames(getUniqueCoinNames(messageArray))
                // console.log(uniqueCoinNames)
            }
        } catch (error) {
            console.log(error)
        }
    }, [messageArray])

    useEffect(() => {
        const holding = uniqueCoinNames.map(elements => {
            return elements.coinName
        })
        setCurrentActiveCoinsList(holding)

        const result = {}
        messageArray.forEach(obj => {
            const data = JSON.parse(obj.data)
            Object.keys(data).forEach(key => {
                if (currentActiveCoinsList.includes(key)) {
                    if (!result[key]) {
                        result[key] = []
                    }
                    result[key].push({
                        value: data[key],
                        timeStampObject: obj.timeStampObject,
                        timeStampCharting: obj.timeStampCharting
                    })
                    if (result[key].length > 15) {
                        let extra = result[key].length - 15
                        setCurrentDeleting([...currentDeleting, { key: key, value: result[key].slice(0, extra) }])
                        result[key] = result[key].slice(extra, result[key].length)
                    }
                }
            })
        })

        setCurrentActiveCoinsData(result)

        // console.log(currentActiveCoinsList)
        // console.log(currentActiveCoinData)


    }, [uniqueCoinNames])


    useEffect(() => {
        // Get the names of the top  active coins
        const topCoins = uniqueCoinNames.slice(0, 4).map(coinData => coinData.coinName);
        // Get the data for these 4 coins
        const topCoinData = topCoins.map(coinName => {
            return {
                coinName: coinName,
                data: currentActiveCoinData[coinName],
            };
        });
        if (
            topCoinData.length === 4 &&
            topCoinData.every(coinData => coinData.data && coinData.data.length >= 2)
        ) {
            setTopActiveCoinData(topCoinData);
        }
    }, [uniqueCoinNames, currentActiveCoinData]);


    // WORKING ON TURNING WEBSOCKET ON AND OFF BASED ON USER INTERACTIVITY/IDLE FROM HERE ON DOWN!!!!

    useEffect(() => {
        console.log(`The User is now ${isIdle ? 'Idle' : 'Not Idle'}`)
        if (isIdle) {
            // Disconnect the websocket
            // console.log('Closing the WebSocket connection');
            webSocketRef.current.close(1000, 'Closing the connection');
        } else {
            // Reconnect the websocket
            // console.log('Reconnecting the WebSocket connection');
            if (webSocketRef.current.readyState === WebSocket.CLOSED || !webSocketRef.current) {
                webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=ALL`);
                webSocketRef.onerror = (event) => {
                    console.error(event);
                    console.error('There is somethiing wrong when setting up a connection to the real time data!!')
                    // Handle possible websockeet errors 
                };
                webSocketRef.current.onmessage = function (msg) {
                    const timeStampObjectData = new Date()
                    const timeStampCharting = `${timeStampObjectData.toLocaleDateString()} ${timeStampObjectData.toLocaleTimeString()}`;
                    const dataWithTimestamp = { data: msg.data, timeStampObject: timeStampObjectData, timeStampCharting: timeStampCharting };

                    setMessageArray((PreviousMessageArray) => {
                        let updatedMessageArray = [...PreviousMessageArray, dataWithTimestamp];
                        if (updatedMessageArray.length > 100) { // Keep only the last 100 data points
                            updatedMessageArray = updatedMessageArray.slice(1); // This removes the oldest data point
                        }
                        return updatedMessageArray;
                    });
                    // console.log(msg.data)
                };
            }
        }
    }, [isIdle, currentActiveCoinsList]);




    useEffect(() => {
        const resetIdleTime = () => {
            // console.log('reseting interval change')

            setIsIdle(false);
            clearInterval(intervalRef.current);

            // Start a new interval that checks for idle time every 15 minutes
            intervalRef.current = setInterval(() => {
                handleIdleChange(true);
            }, 15 * 60 * 1000);
        };
        // Reset the idle time when the user clicks, scrolls, or moves the mouse
        window.addEventListener('mousedown', resetIdleTime);
        window.addEventListener('scroll', resetIdleTime);
        window.addEventListener('mousemove', resetIdleTime);

        // Reset the idle time when the user presses a key or focuses on an element
        window.addEventListener('keydown', resetIdleTime);
        window.addEventListener('focus', resetIdleTime);

        // Reset the idle time when the user touches the screen on a touch device
        window.addEventListener('touchstart', resetIdleTime);

        // Clean up the event listeners when the component unmounts
        return () => {
            console.log('CLEANING!!!CLEANING!!!CLEANING!!!CLEANING!!!')
            window.removeEventListener('mousedown', resetIdleTime);
            window.removeEventListener('scroll', resetIdleTime);
            window.removeEventListener('mousemove', resetIdleTime);
            window.removeEventListener('keydown', resetIdleTime);
            window.removeEventListener('focus', resetIdleTime);
            window.removeEventListener('touchstart', resetIdleTime);
        };


    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            handleIdleChange(true);
        }, 15 * 60 * 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    // console.log(tim, list)

    const buttonCloseConnection = () => {
        // console.log(webSocketRef.current);
        if (webSocketRef.current && webSocketRef.current.readyState !== WebSocket.CLOSED) {
            webSocketRef.current.close();
        }
        console.log("Close Connection button clicked. Live feed stopped. WebSocket connection closed.");
        // console.log(webSocketRef.current);
    }

    const buttonOpenConnection = () => {
        // console.log(webSocketRef.current);
        openingWebsocketLogic()
        console.log("Open Connection button clicked. Live feed Restarted. WebSocket connection Open.");
        // console.log(webSocketRef.current);
    }


    return (
            <div className={isNavOpen ? 'main-nav-open' : 'main-nav-closed'}>
                <Navigation isNavOpen={isNavOpen} onToggle={handleNavToggle} />
                <h1>Real Time Data</h1>
                <div className='div-button'>
                    {isWebSocketActive ?

                        (<button className='stop' onClick={() => buttonCloseConnection()}>Click To Stop</button>) :
                        (<button className='start' onClick={() => buttonOpenConnection()}>Click To Restart Live Crypto Trades</button>)
                    }
                </div>
                <div className='inner'>
                    {topActiveCoinData.length === 4 &&
                        topActiveCoinData.every(coinData => coinData.data.length >= 2) && (
                            <TopTradedChart coinData={topActiveCoinData} />
                        )}
                    {
                        Object.keys(currentActiveCoinData).map(key => {
                            // do something with each key here
                            return (
                                <Suspense fallback={<div>Loading chart...</div>}>
                                    <IndividualCharts key={key} currentCoin={key} currentActiveCoinDataIndividual={currentActiveCoinData[key]}></IndividualCharts>
                                </Suspense>
                            )
                        })
                    }

                </div>
            </div>
    );
}

export default ChartsPage;