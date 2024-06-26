import React from 'react';
import {Link} from 'react-router-dom'
import '../style/landingPage.css'
const LandingPage = () => {
  return (
    <div className='landing-page'>
      <h1 className='land-heading'>UPTIME MONITOR</h1>
      <button className='land-btn'> <Link to="/signup">DASHBOARD</Link> </button>
    </div>
  );
}

export default LandingPage;
