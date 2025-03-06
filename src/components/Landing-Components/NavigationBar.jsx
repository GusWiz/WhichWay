import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <>
      <header className='navbar-header'>
        <nav className='navbar'>
          <h1>WhichWay</h1>
          <ul className='nav-links'>
            <li>
              <NavLink to='/about' activeClassName='active'>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to='/trips' activeClassName='active'>
                Trips
              </NavLink>
            </li>
          </ul>
          <div className='nav-buttons'>
            <button
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                window.location.href = '/signup';
              }}
            >
              Signup
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default NavigationBar;
