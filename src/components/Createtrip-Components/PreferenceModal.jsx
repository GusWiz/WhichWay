import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { collectPreferences, getPreferences } from '../../backend/dataCollect';
import './PreferenceModal.css';
import { db } from '../firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods

function PreferenceModal({ onClose }) {
  const [cuisine, setCuisine] = useState('');
  const [activityType, setActivityType] = useState('');
  const [budget, setBudget] = useState('');
  const [transportation, setTransportation] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Added console log troubleshooting to see if component states are being updated
    // Log each input value to verify they are captured correctly
    //console.log for destination not needed
    if (!cuisine || !activityType || !budget || !transportation) {
      alert("Please fill in all required fields.");
      return;
    }

    collectPreferences(
  //deleted destination
      cuisine,
      activityType,
      budget,
      transportation,
      moreDetails
    );
    const preferencesData = getPreferences();
    console.log('Collected Preferences:', preferencesData);

    onClose();

    try {
      setLoading(true);
      setError(null); // Reset any previous errors
      setSuccess(false); // Reset success message

      // Send preferences to Firestore
      console.log('Sending preferences to Firestore...');
      const docRef = await addDoc(collection(db, 'trip preferences'), preferencesData);
      console.log('Document written with ID: ', docRef.id);
      setSuccess(true); // Set success to true if document is added
    } catch (error) {
      console.error('Error adding document: ', error);
      setError("An error occurred while saving your preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed bg-black backdrop-blur-sm'>
      <div className='bg-white rounded-xl px-8 py-10 flex flex-col gap-5 items-center w-full'>
        <button className='close-btn' onClick={onClose}>
          <X size={30} />
        </button>

        <h1 className='modal-title'>Trip Preferences</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          <div className='flex flex-col'>
            <label htmlFor='cuisine' className='text-lg'>
              Cuisine Preference
            </label>
            <select
              id='cuisine'
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option value=''>Select Cuisine</option>
              <option value='asian'>Asian</option>
              <option value='italian'>Italian</option>
              <option value='mediterranean'>Mediterranean</option>
              <option value='american'>American</option>
              <option value='latin'>Latin American</option>
              <option value='vegan'>Vegan/Vegetarian</option>
              <option value='dessert'>Dessert</option>
              <option value='surprise'>Surprise Me!</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='activityType' className='text-lg'>
              Activity Type
            </label>
            <select
              id='activityType'
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
            >
              <option value=''>Select Activity</option>
              <option value='adventure'>Adventure (Hiking, Scuba Diving)</option>
              <option value='entertainment'>Entertainment (Concerts, Theme Parks)</option>
              <option value='cultural'>Cultural (Museums, Historical Sites)</option>
              <option value='relaxation'>Relaxation (Beaches, Spas)</option>
              <option value='nightlife'>Nightlife (Bars, Clubs)</option>
              <option value='shopping'>Shopping (Markets, Malls)</option>
              <option value='surprise'>Surprise Me!</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='budget' className='text-lg'>
              Budget Preference
            </label>
            <select
              id='budget'
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value=''>Select Budget</option>
              <option value='low'>Budget-Friendly ($)</option>
              <option value='medium'>Mid-Range ($$)</option>
              <option value='high'>Luxury ($$$)</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='transportation' className='text-lg'>
              Transportation Preference
            </label>
            <select
              id='transportation'
              value={transportation}
              onChange={(e) => setTransportation(e.target.value)}
            >
              <option value=''>Select Transportation</option>
              <option value='public'>Public Transport</option>
              <option value='rental'>Rental Car</option>
              <option value='private'>Private Driver</option>
            </select>
          </div>

          <div className='flex flex-col'>
            <label htmlFor='moreDetails' className='text-lg'>
              Additional Details (Optional)
            </label>
            <textarea
              id='moreDetails'
              placeholder='Add any extra preferences...'
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='submit-btn flex justify-center items-center gap-2'
            disabled={loading}
          >
            <CheckCircle size={20} /> {loading ? 'Submitting...' : 'Submit Preferences'}
          </button>
        </form>

        {error && <p className='text-red-500'>{error}</p>}
        {success && <p className='text-green-500'>Preferences successfully submitted!</p>}
      </div>
    </div>
  );
}

export default PreferenceModal;
