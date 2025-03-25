import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { collectPreferences, getPreferences } from '../../backend/dataCollect';
import './PreferenceModal.css';

function PreferenceModal({ onClose }) {
  const [destination, setDestination] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [activityType, setActivityType] = useState('');
  const [budget, setBudget] = useState('');
  const [transportation, setTransportation] = useState('');
  const [moreDetails, setMoreDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    collectPreferences(
      destination,
      cuisine,
      activityType,
      budget,
      transportation,
      moreDetails
    );

    console.log(getPreferences());
    onClose();
  };

  return (
    <div className='fixed bg-black backdrop-blur-sm'>
      <div className='bg-white rounded-xl px-8 py-10 flex flex-col gap-5 items-center w-full'>
        <button className='close-btn' onClick={onClose}>
          <X size={30} />
        </button>

        <h1 className='modal-title'>Trip Preferences</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          {/* Destination */}
          <div className='flex flex-col'>
            <label htmlFor='destination' className='text-lg'>
              Preferred Destination
            </label>
            <input
              type='text'
              id='destination'
              placeholder='Enter destination'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Cuisine Preference (Yelp API) */}
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
              <option value='mediterranean'>Mediterranean</option>
              <option value='latin'>Latin American</option>
            </select>
          </div>

          {/* Activity Type (Google Places API) */}
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
              <option value='adventure'>
                Adventure (Hiking, Scuba Diving)
              </option>
              <option value='entertainment'>
                Entertainment (Concerts, Theme Parks)
              </option>
              <option value='cultural'>
                Cultural (Museums, Historical Sites)
              </option>
            </select>
          </div>

          {/* Budget Category (YNAB API) */}
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

          {/* Transportation Type (Google Maps API) */}
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

          {/* More Details */}
          <div className='flex flex-col'>
            <label htmlFor='moreDetails' className='text-lg'>
              Additional Details (Optional)
            </label>
            <textarea
              id='moreDetails'
              placeholder='Add any extra preferences'
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type='submit'
            className='submit-btn flex justify-center items-center gap-2'
          >
            <CheckCircle size={20} /> Submit Preferences
          </button>
        </form>
      </div>
    </div>
  );
}

export default PreferenceModal;
