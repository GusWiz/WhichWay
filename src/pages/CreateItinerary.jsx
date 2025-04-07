import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useLocation } from 'react-router-dom';

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';
import logo from '../components/images/logo.svg';

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
  const location = useLocation();
  const [itineraryData, setItineraryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    location: tripLocation,
    startDate,
    endDate,
    dayStartTime = '09:00',
    dayEndTime = '20:00',
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
  } = location.state || {};

  const activities = [
    ...selectedFoods.map((food) => food.name),
    ...selectedEntertainment.map((entertainment) => entertainment.name),
    ...selectedOutdoor.map((outdoor) => outdoor.name),
  ];

  const handleRegenerateItinerary = async () => {
    setLoading(true);
    try {
      const newItinerary = await generateItineraryService({
        location: tripLocation,
        startDate,
        endDate,
        dayStartTime,
        dayEndTime,
        activities,
      });

      setItineraryData(newItinerary.schedule || []);
      console.log('New itinerary generated:', newItinerary);
    } catch (error) {
      console.error('Error regenerating itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className='home-page'>
        <div className='home-container'>
          <Sidebar logout={logout} />
          <div className='home-contents'>
            <div className='itinerary-container'>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Itinerary;
