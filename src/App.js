import './App.css';
import Navigation from './views/Navigation';
import { React, useState } from 'react'


function App() {

  const [isNavOpen, setIsNavOpen] = useState(false);
  const handleNavToggle = (newValue) => {
    setIsNavOpen(newValue);
  }
  return (
    <div className={isNavOpen ? 'App-nav-open' : 'App-nav-closed'} >
      <div className={isNavOpen ? 'main-nav-open' : 'main-nav-closed'}>
        <Navigation isNavOpen={isNavOpen} onToggle={handleNavToggle} />
        <div className='inner'>
        </div>
      </div>
    </div>
  );
}

export default App;
