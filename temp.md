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

      _____
      
import React from 'react';
import '../static/HomeBody.css'; // Import the CSS file

function HomeBody() {
  return (
    <main className="home-body">
      <div className="option-boxes">
        <button onClick={() => history.push('/create-trip')}>Create New Trip</button>
        <button onClick={() => history.push('/load-trip')}>Load Existing Trip</button>
      </div>
    </main>
  );
}

export default HomeBody;