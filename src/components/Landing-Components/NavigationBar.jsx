import React from 'react';
import logo from '../images/logo.svg';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <>
      <header className='navbar-header'>
        <div className='navbar-container'>
          <div className='navbar-logo'>
            <img src={logo} alt='Logo' className='logo-icon' />
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
