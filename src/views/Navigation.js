import { React, useState } from 'react'
import { ToggleIcon, LogoIcon, NewsIcon, ChartIcon, HomeIcon } from '../svg/NavSvg';



function Navigation(props) {
    const [isNavOpen, setIsNavOpen] = useState(props.isNavOpen);

    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
        props.onToggle(!isNavOpen);
    }

    window.onscroll = function () {
        var navbar = document.getElementById("navbar");
        if (window.pageYOffset > 0) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    return (
        <nav id="navbar" className={isNavOpen ? 'nav-nav-open' : 'nav-nav-closed'}>
            {isNavOpen && (
                <button className={isNavOpen ? 'nav-open-button' : 'nav-closed-button'} onClick={handleToggle}>
                    <ToggleIcon />
                </button>
            )}
            {!isNavOpen && (
                <button className={isNavOpen ? 'nav-open-button' : 'nav-closed-button'} onClick={handleToggle}>
                    <ToggleIcon />
                </button>
            )}
            {isNavOpen && (
                <ul>
                    <li><a href="https://carlosamadoroller.com" ><LogoIcon /><span>Created By : <br /> Carlos <br /> Amado Roller</span></a></li>
                    <li><a href="/"><HomeIcon /><span>Back to  <br /> Crypto Home</span></a></li>
                    <li><a href="/charts"><ChartIcon /><span>Visit  <br />  Crypto Analytics</span></a></li>
                    <li><a href="/News"><NewsIcon /><span>Visit  <br />  Crypto News</span></a></li>
                </ul>
            )}
        </nav>

    );
}

export default Navigation;
