import { React, useState } from 'react'
import { ToggleIcon, LogoIcon, NewsIcon } from '../svg/NavSvg';



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
                    <li><a href="#Home"><LogoIcon /><span>Created By : <br /> Carlos <br /> Amado <br /> Roller</span></a></li>

                    <li><a href="#Home"><NewsIcon /><span>Visit Crypto News</span></a></li>
                </ul>
            )}
        </nav>

    );
}

export default Navigation;
