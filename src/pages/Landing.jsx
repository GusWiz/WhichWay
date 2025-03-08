import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Landing-Components/NavigationBar';

// Mising proper routing after the buttons are pressed
function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <NavigationBar />
      <div className='landing-body'>
        <div className='landing-card'>
          <div className='landingcard-title'>
            <h2>What is WhichWay?</h2>
          </div>
          <div className='landingcard-text'>
            <p>
              Tired of spending hours searching for things to do?
              <br></br>
              <br></br>
              Let AI handle the planning for you! Our smart trip planner finds
              the best activities based on your preferences and location, then
              creates a personalized itinerary—so you can focus on enjoying your
              trip.
            </p>
          </div>
          <div className='landingcard-buttons'>
            <button
              className='landing-button'
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className='landing-button'
              onClick={() => navigate('/signup')}
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
