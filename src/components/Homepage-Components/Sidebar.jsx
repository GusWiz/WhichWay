import React from 'react';
import './Sidebar.css';
import { getSidebarData } from './SidebarData';
import ErrorBoundary from './ErrorBoundary';

function Sidebar({ logout }) {
  let SidebarData = []; // Arrary represent list of items that will be display in the side bar
  try{
    SidebarData = getSidebarData(logout);
  } catch (error) {
    console.errorr("Error fetching sidebar data", error)
  }

  return (
    <ErrorBoundary>
      <div className='Sidebar'>
        <ul className='SidebarList'>
          {SidebarData.map((val, key) => {
            return (
              <li
                key={key}
                className='row'
                id={window.location.pathname == val.link ? 'active' : ''}
                onClick={() => {
                  if (val.onClick) {
                    val.onClick();
                  } else {
                    window.location.pathname = val.link;
                  }
                }}
              >
                {' '}
                <div id='icon'>{val.icon}</div>{' '}
                <div id='title'>{val.title}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </ErrorBoundary>
  );
}

export default Sidebar;
