import { React, useState, useEffect, useRef, Suspense, lazy, useMemo } from 'react'

import Navigation from './Navigation.js';
const IndividualCharts = lazy(() => import('./IndividualCharts'));

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
    const [tim, setTim] = useState([]);
    const [uniqueCoinNames, setUniqueCoinNames] = useState([]);
    const [currentActiveCoinsList, setCurrentActiveCoinsList] = useState([]);
    const [currentActiveCoinData, setCurrentActiveCoinsData] = useState([]);

    useEffect(() => {
        if (!webSocketRef.current) {
            // create the WebSocket connection if it doesn't already exist
            webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=ALL`);

            webSocketRef.onerror = (event) => {
                console.error(event);
                console.error('There is somethiing wrong when setting up a connection to the real time data!!')
                // Handle possible websockeet errors 
            };
        }
        webSocketRef.current.onmessage = function (msg) {
            const timeStampObjectData = new Date()
            const timeStampCharting = `${timeStampObjectData.toLocaleDateString()} ${timeStampObjectData.toLocaleTimeString()}`;
            const dataWithTimestamp = { data: msg.data, timeStampObject: timeStampObjectData, timeStampCharting: timeStampCharting };

            setTim((prevTim) => [...prevTim, dataWithTimestamp]);

            // console.log(msg.data)
        };

        document.addEventListener('visibilitychange', () => {
            handleIdleChange(document.hidden);
        });

        return () => {
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
            if (webSocketRef.current.readyState === WebSocket.CLOSED) {
                webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=ALL`);
            }
            if (webSocketRef.current.readyState === WebSocket.OPEN) {

                function getUniqueCoinNames(data) {
                    // Create an empty object to store the unique coin names and their counts
                    const uniqueCoinNamesObject = {};

                    // Iterate through the array of objects
                    for (const datum of data) {
                        // Parse the data field into a JavaScript object
                        const coinOnlyData = JSON.parse(datum.data);
                        const coinDateObjectUnix = datum.timeStampObject.getTime()

                        // const pastTimeStamp
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
                                // Increment the total count for the coin
                                uniqueCoinNamesObject[coinName].totalCount++;
                            } else {
                                // Add the coin to the uniqueCoinNamesObject object with a count of 1 and a total count of 1
                                uniqueCoinNamesObject[coinName] = { cacheCount: 1, totalCount: 1 };
                            }
                        }
                    }

                    // Convert the object to an array of objects
                    let uniqueCoinNamesObjectArray = Object.entries(uniqueCoinNamesObject).map(([coinName, { cacheCount, totalCount }]) => ({ coinName, cacheCount, totalCount }));

                    // Sort the array by the count in descending order
                    uniqueCoinNamesObjectArray.sort((a, b) => b.cacheCount - a.cacheCount);

                    uniqueCoinNamesObjectArray = uniqueCoinNamesObjectArray.slice(0, 38)
                    // Return the sorted array
                    return uniqueCoinNamesObjectArray;
                }

                setUniqueCoinNames(getUniqueCoinNames(tim))
                // console.log(uniqueCoinNames)
            } else {
                console.error(`The current Websocket Connection is not active ${webSocketRef.current}`)
            }
        } catch (error) {
            console.log(error)
            if (webSocketRef.current.readyState === WebSocket.CLOSED) {
                webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=ALL`);
            }

        }
    }, [tim])

    useEffect(() => {
        const holding = uniqueCoinNames.map(elements => {
            return elements.coinName
        })
        setCurrentActiveCoinsList(holding)


        const result = {}

        tim.forEach(obj => {
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
                }
            })
        })

        setCurrentActiveCoinsData(result)

        console.log(currentActiveCoinsList)
        console.log(currentActiveCoinData)


    }, [uniqueCoinNames])


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
                    const currentDate = new Date();
                    const timestamp = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
                    const dataWithTimestamp = { data: msg.data, timestamp };

                    setTim((prevTim) => [...prevTim, dataWithTimestamp]);
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



    return (
        <div className={isNavOpen ? 'App-nav-open' : 'App-nav-closed'} >
            <div className={isNavOpen ? 'main-nav-open' : 'main-nav-closed'}>
                <Navigation isNavOpen={isNavOpen} onToggle={handleNavToggle} />
                <h1>Real Time Data</h1>
                <div className='inner'>
                    <div className='inner-inner-first'></div>
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
        </div>
    );
}

export default ChartsPage;