import './App.css';
// import Navigation from './views/Navigation';
// import { React, useState } from 'react'
import ChartsPage from './views/ChartsPage.js';
import { Routes, Route } from 'react-router-dom'
import LandingPage from './views/LandingPage';
import { Analytics } from '@vercel/analytics/react';


function App() {

  // const [isNavOpen, setIsNavOpen] = useState(false);
  // const handleNavToggle = (newValue) => {
  //   setIsNavOpen(newValue);
  // }

  // isNavOpen={isNavOpen} onToggle={handleNavToggle}
  return (
    <div className='max'>
      <Routes>
        <Route path='/charts' element={<ChartsPage />} />
        <Route path='/' element={<LandingPage />} />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
