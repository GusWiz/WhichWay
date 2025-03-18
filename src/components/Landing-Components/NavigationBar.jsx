import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <>
      <header className='navbar-header'>
        <div className='navbar-container'>
          <div className='navbar-logo'>
            <img src='src\assets\logo.svg' alt='Logo' className='logo-icon' />
          </div>
          <div className='navbar-title'>
            <h1>WhichWay</h1>
          </div>
        </div>
      </header>
    </>
  );
}

export default NavigationBar;
