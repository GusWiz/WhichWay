import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Import directly from backend instead of through api layer
import { generateItinerary } from '../backend/openAI';

import './Home.css';
import './Landing.css';
import './CreateItinerary.css';

import NavigationBar from '../components/Landing-Components/NavigationBar';
import Sidebar from '../components/Homepage-Components/Sidebar';

function Itinerary() {
  const navigate = useNavigate();
  const location = useLocation();
  const printRef = useRef(null);

  // Get data from location state or use defaults
  const {
    location: tripLocation = 'San Marcos',
    startDate: startDateValue = '2025-04-15',
    duration: durationValue = '3 days',
    selectedFoods = [],
    selectedEntertainment = [],
    selectedOutdoor = [],
    tripName = 'My Trip',
    tripId = null,
    itineraryData: initialItineraryData = []
  } = location.state || {};

  // Use the provided itinerary data if available
  const [itineraryData, setItineraryData] = useState(initialItineraryData);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };

  // Function to download itinerary as PDF
  const handleDownloadPDF = async () => {
    const element = printRef.current;

    if (!element) {
      toast.error('No content to download');
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });

      const imageProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight =
        (imageProperties.height * pdfWidth) / imageProperties.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Itinerary.pdf');
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  // Function to generate itinerary with OpenAI directly
  // Uses the same approach as in EditTrip.jsx
  const handleGenerateItinerary = async () => {
    setLoading(true);
    try {
      // Create activities array from selected items
      const activityList = [
        ...selectedFoods.map(food => food.name),
        ...selectedEntertainment.map(entertainment => entertainment.name),
        ...selectedOutdoor.map(outdoor => outdoor.name)
      ];

      // Use default activities if activityList is empty
      const finalActivityList = activityList.length > 0 ? activityList : [
        'Chilis',
        'Sewell Park',
        'Double Daves',
        'EVO',
        'Chi Lantro',
        'Golds Gym',
        'Hiking trail',
      ];

      // Construct the OpenAI request content
      const openaiRequest = `
Location: ${tripLocation}
Start date: ${startDateValue}
Duration: ${durationValue}
Activity List:
${finalActivityList.map((activity) => `- ${activity}`).join('\n')}
`;

      console.log('OpenAI Request:', openaiRequest);

      // Call the generateItinerary function directly
      const itineraryResponse = await generateItinerary(openaiRequest);

      if (!itineraryResponse) {
        throw new Error('Failed to generate a valid itinerary');
      }

      // Parse the JSON response
      const parsedItinerary = JSON.parse(itineraryResponse);

      if (!parsedItinerary || !parsedItinerary.schedule) {
        throw new Error('Invalid itinerary format received');
      }

      setItineraryData(parsedItinerary.schedule || []);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="home-page">
        <div className="home-container">
          <Sidebar logout={logout} />
          <div className="home-contents">
            <div ref={printRef} className="itinerary-container">
              <div className="createititnerary-title">
                <h1>Create Itinerary</h1>
                <h2>for {tripLocation}</h2>
              </div>

              {/* Display loading spinner or itinerary data */}
              {loading ? (
                <div className="loading-container">
                  <p>Loading itinerary...</p>
                  <div className="spinner"></div>
                </div>
              ) : itineraryData.length > 0 ? (
                itineraryData.map((dayData, dayIndex) => (
                  <div key={dayIndex} className="itinerary-day">
                    <div className="itinerary-daytitle">
                      <h2>Day {dayIndex + 1}: {dayData.date}</h2>
                    </div>
                    <div className="itinerary-itemscontainer">
                      {dayData.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="itinerary-item">
                          <div className="itinerary-itemtime">
                            <h3>
                              {activity.start_time} - {activity.end_time || 'TBD'}
                            </h3>
                          </div>
                          <div className="itinerary-item-details">
                            <div className="itinerary-item-title">
                              <h3>{activity.name}</h3>
                            </div>
                            <p>
                              {activity.description ||
                                'No description available'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>
                  No itinerary data available. Click "Generate Itinerary" to
                  create one.
                </p>
              )}

              {/* Buttons for managing itinerary */}
              <div className="itinerary-buttons">
                <button
                  className="itinerary-button"
                  onClick={handleGenerateItinerary}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Itinerary"}
                </button>

                <button
                  className="itinerary-button"
                  onClick={() => navigate('/home')}
                >
                  Back to Home
                </button>
                <button
                  className="itinerary-button"
                  onClick={handleDownloadPDF}
                  disabled={!itineraryData.length}
                >
                  Download Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </>
  );
}

export default Itinerary;
