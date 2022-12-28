import { React, useState, useEffect, useRef, Suspense, lazy, useMemo } from 'react'
import Navigation from './Navigation.js';
const IndividualCharts = lazy(() => import('./IndividualCharts'));

function ChartsPage() {

    const [isNavOpen, setIsNavOpen] = useState(false);
    const handleNavToggle = (newValue) => {
        setIsNavOpen(newValue);
    }

    const list = useMemo(() => ['bitcoin', 'ethereum', 'xrp', 'dogecoin', 'litecoin', 'cardano'], []);    // console.log(list.map(x => x))
    // console.log(`prices?assets=${list}'`)

    const webSocketRef = useRef(null);

    const [tim, setTim] = useState([]);

    useEffect(() => {
        webSocketRef.current = new WebSocket(`wss://ws.coincap.io/prices?assets=${list}`);

        webSocketRef.current.onmessage = function (msg) {
            const currentDate = new Date();
            const timestamp = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
            const dataWithTimestamp = { data: msg.data, timestamp };

            setTim((prevTim) => [...prevTim, dataWithTimestamp]);
        };


        // return () => {
        //     // this function is called when the component unmounts
        //     try {
        //         webSocketRef.current.close(1000, 'Closing the connection');
        //     } catch (error) {
        //         console.error(error);
        //     }
        // };
    }, [list]); // this empty array ensures that the effect only runs once when the component mounts

    console.log(tim, list)


    return (
        <div className={isNavOpen ? 'App-nav-open' : 'App-nav-closed'} >
            <div className={isNavOpen ? 'main-nav-open' : 'main-nav-closed'}>
                <Navigation isNavOpen={isNavOpen} onToggle={handleNavToggle} />
                <h1>Real Time Data (EST)</h1>
                <div className='inner'>
                    {list.map((x) => {
                        console.log('what what 2')
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