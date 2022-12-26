import { useNavigate } from 'react-router-dom';


function LandingPage() {
    const navigate = useNavigate();



    return (
        <div className="landingpage">
            <h2>Welcome to The Crypto Application</h2>

            <div className="landingpage-paragraph">
                <p>Hello and welcome to my crypto and web design webpage! As the creator of this brand new application, I am excited to introduce you to my passion project. I am a web designer with a love for all things crypto, and I wanted to create a resource that would help others stay up-to-date on the latest developments in the world of cryptocurrency.</p>
                <p>I have carefully designed my application to be both functional and easy to use. I understand that crypto can be intimidating, so I have created a user-friendly interface to make it accessible to everyone. My application is a valuable resource for staying up-to-date on the latest crypto news and developments. Thank you for visiting my website and I hope you enjoy using my application.</p>
            </div>
            <a href="https://carlosamadoroller.com" className="landingpage-button1">
                Back To <br/> Main Website
            </a>
            <button className="landingpage-button2" onClick={() => navigate('/charts')}>Crypto Analytics</button>
            <button className="landingpage-button3" onClick={() => navigate('/news')}>Crypto News</button>
        </div>
    );
}

export default LandingPage;