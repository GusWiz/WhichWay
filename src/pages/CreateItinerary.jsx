import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf";

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import logo from '../components/images/logo.svg';
import html2canvas from 'html2canvas';
import { Portrait } from '@mui/icons-material';

function Itinerary() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  const printRef = React.useRef(null);

  const handleDownloadPDF = async () =>
  {
    const element = printRef.current

    if(!element)
    {
      return;
    }
    console.log(element)

    const canvas = await html2canvas(element)
    const data = canvas.toDataURL('/image/png')

    const pdf = new jsPDF(
      {
        orientation: "portrait",
        unit: "px",
        format: "a4"
      }
    );

    pdf.addImage(data, "PNG", 0, 0, 100, 100)
    pdf.save("Itinerary.pdf")


  }

  const itineraryData = [
    {
      day: 1,
      items: [
        {
          startTime: '9:00 AM',
          endTime: '12:00 PM',
          location: "Double Dave's",
          description: '',
          budget: '',
        },
        {
          startTime: '12:00 PM',
          endTime: '2:00 PM',
          location: "Triple Dave's",
          description: '',
          budget: '',
        },
        {
          startTime: '4:00 PM',
          endTime: '6:00 PM',
          location: "Double Dave's",
          description: '',
          budget: '',
        },
        {
          startTime: '6:00 PM',
          endTime: '7:00 PM',
          location: "Triple Dave's",
          description: '',
          budget: '',
        },
      ],
    },
    {
      day: 2,
      items: [
        {
          startTime: '2:00 PM',
          endTime: '4:00 PM',
          location: "Quadruple Dave's",
          description: '',
          budget: '',
        },
        {
          startTime: '4:00 PM',
          endTime: '6:00 PM',
          location: "Quintuple Dave's",
          description: '',
          budget: '',
        },
      ],
    },
  ];

  const location = useLocation();
  const {
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
  } = location.state || {};

  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
            <div ref = {printRef} className='itinerary-container'>
              <div className='createititnerary-title'>
                <h1>Create Itinerary</h1>
              </div>

              {itineraryData.map((dayData) => (
                <div key={dayData.day} className='itinerary-day'>
                  <div className='itinerary-daytitle'>
                    <h1>Day {dayData.day}</h1>
                  </div>
                  <div className='itinerary-itemscontainer'>
                    {dayData.items.map((item, index) => (
                      <div key={index} className='itinerary-item'>
                        <div className='itinerary-itemtime'>
                          <h1>
                            {item.startTime} - {item.endTime}
                          </h1>
                        </div>
                        <div className='itinerary-item-details'>
                          <div className='itinerary-item-title'>
                            <h1>{item.location}</h1>
                          </div>
                          <div className='navbar-logo'>
                            <img src={logo} alt='Logo' className='logo-icon' />
                          </div>
                          <p>Here is a descrtiption of the place</p>
                          <p>Here is the budget of the place</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className='itinerary-buttons'>
                <button className='itinerary-button' onClick=''>
                  {' '}
                  Regenerate Itinerary{' '}
                </button>
                <button
                  className='itinerary-button'
                  onClick={() => navigate('/home')}
                >
                  {' '}
                  Save Itinerary{' '}
                </button>
                <button className="itinerary-button" onClick={handleDownloadPDF}>
                Download Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Itinerary;
