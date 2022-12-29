import { useNavigate } from 'react-router-dom';
import { React, useState, useEffect, useRef } from 'react'

function LandingPage() {
    const navigate = useNavigate();

    const [tim, setTim] = useState([]);
    const webSocketRef = useRef(null);

    var [uniqueCoinNames, setUniqueCoinNames] = useState([]);


    useEffect(() => {
        function memoryCache() {
            if (uniqueCoinNames.length >= 54) {
                console.log('Slicing the Array')
                setUniqueCoinNames(uniqueCoinNames.slice(0, 54));
            }
        }

        let intervalId = setInterval(memoryCache, 30000);

        return () => {
            clearInterval(intervalId)
        }
    }, []
    )
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
            const dataWithTimestamp = { data: msg.data, timeStampObject: timeStampObjectData, timeStampCharting };

            setTim((prevTim) => [...prevTim, dataWithTimestamp]);

            // console.log(msg.data)
        };
        return () => {
            // close the WebSocket connection when the component unmounts
            try {
                // clearInterval(intervalId)
                webSocketRef.current.close(1000, 'Closing the connection');
            } catch (error) {
                console.error(error);
            }
        }
    }, [])

    useEffect(() => {
        try {
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
                            if (currentTimestampUnix - coinDateObjectUnix < 40000) {
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
                const uniqueCoinNamesObjectArray = Object.entries(uniqueCoinNamesObject).map(([coinName, { cacheCount, totalCount }]) => ({ coinName, cacheCount, totalCount }));

                // Sort the array by the count in descending order
                uniqueCoinNamesObjectArray.sort((a, b) => b.cacheCount - a.cacheCount);

                // Return the sorted array
                return uniqueCoinNamesObjectArray;
            }

            setUniqueCoinNames(getUniqueCoinNames(tim))

        } catch (error) {
            console.log(error)
        }
    }, [tim])

    console.log(uniqueCoinNames)
    // console.log(tim[0].timeStampObject.getTime())
    // console.log(uniqueCoinNames)


    return (
        <div className="landingpage">
            <h2>Welcome to The Crypto Application</h2>

            <div className="landingpage-paragraph">
                <p>Hello and welcome to my crypto and web design webpage! As the creator of this brand new application, I am excited to introduce you to my passion project. I am a web designer with a love for all things crypto, and I wanted to create a resource that would help others stay up-to-date on the latest developments in the world of cryptocurrency.</p>
                <p>I have carefully designed my application to be both functional and easy to use. I understand that crypto can be intimidating, so I have created a user-friendly interface to make it accessible to everyone. My application is a valuable resource for staying up-to-date on the latest crypto news and developments. Thank you for visiting my website and I hope you enjoy using my application.</p>
            </div>
            <a href="https://carlosamadoroller.com" className="landingpage-button1">
                Back To <br /> Main Website
            </a>
            <button className="landingpage-button2" onClick={() => navigate('/charts')}>Crypto Analytics</button>
            <button className="landingpage-button3" onClick={() => navigate('/news')}>Crypto News</button>
        </div>
    );
}

export default LandingPage;