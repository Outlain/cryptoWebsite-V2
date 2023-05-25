import { React, useState, useEffect, useRef, Suspense, lazy, useMemo } from 'react'

import Navigation from './Navigation.js';
const IndividualCharts = lazy(() => import('./IndividualCharts.js'));

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
    const list = useMemo(() => ['bitcoin', 'ethereum', 'eos', 'tezos', 'kava', 'xrp', "sushiswap", 'dogecoin', 'binance-coin', 'cardano', 'nano', 'polygon', 'polkadot', 'dodo', 'monero', 'solanium', 'avalanche', 'chainlink', 'litecoin', 'sushiswap'], []);    // console.log(list.map(x => x))
    // console.log(`prices?assets=${list}'`)

    const webSocketRef = useRef(null);
    const [tim, setTim] = useState([]);

    useEffect(() => {
        if (!webSocketRef.current) {
            // create the WebSocket connection if it doesn't already exist
            webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=${list}`);

            webSocketRef.onerror = (event) => {
                console.error(event);
                console.error('There is somethiing wrong when setting up a connection to the real time data!!')
                // Handle possible websockeet errors 
            };
        }
        webSocketRef.current.onmessage = function (msg) {
            const currentDate = new Date();
            const timestamp = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
            const dataWithTimestamp = { data: msg.data, timestamp };

            setTim((prevTim) => [...prevTim, dataWithTimestamp]);
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
    }, [list]);

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
                webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=${list}`);
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
    }, [isIdle, list]);


    console.log(tim)


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
                    {list.map((x) => {
                        // filter the tim state array to only include the data with the current x value
                        const filteredTim = tim.filter(item => JSON.parse(item.data)[x]);

                        return (
                            <Suspense fallback={<div>Loading chart...</div>}>
                                <IndividualCharts currentCoin={x} tim={filteredTim}></IndividualCharts>
                            </Suspense>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ChartsPage;