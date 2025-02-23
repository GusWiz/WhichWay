import React from "react";
import { NavLink } from 'react-router-dom';
import '../../NavigationBar.css';

function NavigationBar() {
  return (
    <header className="navbar-header">
    <nav className="navbar">
      <NavLink to='/' className="logo">
        <h1>Trip Planner Image Goes Here</h1>
      </NavLink>
      <ul className="nav-links">
        <li><NavLink to='/about' activeClassName="active">About</NavLink></li>
        <li><NavLink to='/trips' activeClassName="active">Trips</NavLink></li>
      </ul>
      <div className="nav-buttons">
        <button onClick={() => { window.location.href = '/login'; }}>Login</button>
        <button onClick={() => { window.location.href = '/signup'; }}>Get Started</button>
      </div>
    </nav>
  </header>
  );
}

export default NavigationBar;
