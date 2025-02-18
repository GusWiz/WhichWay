import React, {useState} from 'react';
import * as FaIcons from 'react-icons/fa';
import * as GrIcons from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { SidebarData } from "./SidebarData.jsx";
import "../App.css";
import { IconContext } from "react-icons";

function Navbar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(sidebar);

    return(
        <>
            <IconContext.Provider value={{color: "undefined"}}>
                <div className="navbar">
                    <Link to ="#" className="menu-bars">
                        <FaIcons.FaBars onClickCapture={showSidebar} />
                    </Link>
                </div>
                <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                    <ul className="nav-menu-items" onClicl={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bars">
                                <GrIcons.GrClose />
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.className}>
                                    <Link to={item.path}>
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    )

}

export default Navbar;