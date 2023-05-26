import { useNavigate } from 'react-router-dom';
import { React } from 'react'

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landingpage">
            <h2>Welcome to The Crypto Application</h2>

            <div className="landingpage-paragraph">
                <p>Hello and welcome to my crypto Application. This Website uses Websocket Technology to create real time cryoto data and uses clever formating of this data to create charts that show UP/Down and percentage changes ect .. </p>
                <p>I have carefully designed my application to be both functional and easy to use, if the data is too much for your computer you can always turn off the Websocket Connection by clicking the stop button!</p>
                <p>The data will initially load with the current last traded coins and when enough data is loaded a chart will apear in the middle with the top 4 most traded coins in the last 30 seconds that will show how they compare</p>
            </div>
            <a href="https://carlosamadoroller.com" className="landingpage-button landingpage-button1">
                Back To <br /> Main Website
            </a>
            <button className="landingpage-button landingpage-button2" onClick={() => navigate('/charts')}>Crypto Analytics</button>
            <button className="landingpage-button landingpage-button3" onClick={() => navigate('/news')}>Crypto News</button>
        </div>
    );
}

export default LandingPage;