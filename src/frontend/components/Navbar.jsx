// components/Navbar.js
import React from "react";
import "../styles/Navbar.css";
 

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">MyApp</div>
            <div className="nav-links">
                <button className="btn login">Login</button>
                <button className="btn get-started">Get Started</button>
            </div>
        </nav>
    );
};

export default Navbar;
