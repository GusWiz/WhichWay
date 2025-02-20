import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
          <h1>Logo image</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/about' activeStyle>
            About
          </NavLink>
          <NavLink to='/trips' activeStyle>
            Trips
          </NavLink>
          <NavLink to='/sign-up' activeStyle>
            Sign Up
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/signin'>Sign In</NavBtnLink>
        </NavBtn>
        <nav classname="navbar">
            <ul>
                <fa-ul><button onclick="location.href''">Login</button></fa-ul>
                <fa-ul><button onclick="location.href''">Get Started</button></fa-ul>            
            </ul>
      </nav>
      </Nav>
    </>
  );
};

export default Navbar;
