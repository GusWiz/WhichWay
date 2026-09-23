import React from 'react';
import './Sidebar.css';
import { getSidebarData } from './SidebarData';
import ErrorBoundary from './ErrorBoundary';
import { useNavigate } from 'react-router-dom'; // For navigation

function Sidebar({ logout }) {
  let SidebarData = []; // Array representing the list of items displayed in the sidebar
  const navigate = useNavigate(); // Navigation hook to navigate programmatically

  try {
    SidebarData = getSidebarData(logout);
  } catch (error) {
    console.error('Error fetching sidebar data', error);
  }

  // Function to reset tripId when creating a new trip
  const handleCreateTripClick = () => {
    // Reset tripId in localStorage by setting it to an empty string
    localStorage.setItem('tripId', ''); // Set tripId to empty string (not 'null')

    // Optionally, navigate to the "Create Trip" page
    navigate('/createtrip'); // If you're using react-router
  };

  return (
    <ErrorBoundary>
      <div className='Sidebar'>
        <ul className='SidebarList'>
          {SidebarData.map((val, key) => {
            return (
              <li
                key={key}
                className='row'
                id={window.location.pathname === val.link ? 'active' : ''}
                onClick={() => {
                  if (val.title === 'Create Trip') {
                    handleCreateTripClick(); // Handle click for Create Trip
                  } else if (val.onClick) {
                    val.onClick(); // Call the onClick function if present
                  } else {
                    window.location.pathname = val.link; // Default behavior for other items
                  }
                }}
              >
                <div id='icon'>{val.icon}</div>
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
