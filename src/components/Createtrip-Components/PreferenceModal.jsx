import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { collectPreferences, getPreferences } from '../../backend/dataCollect';
import './PreferenceModal.css';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function PreferenceModal({ onClose }) {
  const [cuisine, setCuisine] = useState('');
  const [activityType, setActivityType] = useState('');
  const [budget, setBudget] = useState('');
  const [transportation, setTransportation] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Options for surprise me selections (only for cuisine and activity)
  const surpriseOptions = {
    cuisine: [
      'asian',
      'italian',
      'mediterranean',
      'american',
      'latin',
      'vegan',
      'dessert',
    ],
    activityType: [
      'adventure',
      'entertainment',
      'cultural',
      'relaxation',
      'nightlife',
      'shopping',
    ],
  };

  const getRandomOption = (field) => {
    const options = surpriseOptions[field];
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!cuisine || !activityType || !budget || !transportation) {
    //   alert('Please fill in all required fields.');
    //   return;
    // }

    // Generate random selections only for cuisine and activity if "surprise" was chosen
    const actualSelections = {
      cuisine: cuisine === 'surprise' ? getRandomOption('cuisine') : cuisine,
      activityType:
        activityType === 'surprise'
          ? getRandomOption('activityType')
          : activityType,
      budget,
      transportation,
      moreDetails,
    };

    collectPreferences(
      actualSelections.cuisine,
      actualSelections.activityType,
      actualSelections.budget,
      actualSelections.transportation,
      actualSelections.moreDetails
    );

    const preferencesData = getPreferences();
    console.log('Collected Preferences:', preferencesData);

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const docRef = await addDoc(collection(db, 'trip preferences'), {
        ...preferencesData,
        wasSurprise: {
          cuisine: cuisine === 'surprise',
          activityType: activityType === 'surprise',
        },
      });

      console.log('Document written with ID: ', docRef.id);
      setSuccess(true);
    } catch (error) {
      console.error('Error adding document: ', error);
      setError('An error occurred while saving your preferences.');
    } finally {
      setLoading(false);
    }

    onClose();
  };

  //on line 104, i added an id so that it doesn't confuse what button is being clicked. it know the button based on the id
  return (
    <div className='fixed bg-black backdrop-blur-sm'>
      <div className='bg-white rounded-xl px-8 py-10 flex flex-col gap-5 items-center w-full'>
        <button className='close-btn' data-testid='close-btn' onClick={onClose}>
          <X size={30} />
        </button>

        <h1 className='modal-title'>Trip Preferences</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
          {/* Cuisine Preference with Surprise Me option */}
          <div className='flex flex-col'>
            <label htmlFor='cuisine' className='text-lg'>
              Cuisine Preference
            </label>
            <select
              id='cuisine'
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              //required
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

          {/* Activity Type with Surprise Me option */}
          <div className='flex flex-col'>
            <label htmlFor='activityType' className='text-lg'>
              Activity Type
            </label>
            <select
              id='activityType'
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              //required
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
              <option value='relaxation'>Relaxation (Beaches, Spas)</option>
              <option value='nightlife'>Nightlife (Bars, Clubs)</option>
              <option value='shopping'>Shopping (Markets, Malls)</option>
              <option value='surprise'>Surprise Me!</option>
            </select>
          </div>

          {/* Budget Preference (no Surprise Me option) */}
          <div className='flex flex-col'>
            <label htmlFor='budget' className='text-lg'>
              Budget Preference
            </label>
            <select
              id='budget'
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              //required
            >
              <option value=''>Select Budget</option>
              <option value='low'>Budget-Friendly ($)</option>
              <option value='medium'>Mid-Range ($$)</option>
              <option value='high'>Luxury ($$$)</option>
            </select>
          </div>

          {/* Transportation Preference (no Surprise Me option) */}
          <div className='flex flex-col'>
            <label htmlFor='transportation' className='text-lg'>
              Transportation Preference
            </label>
            <select
              id='transportation'
              value={transportation}
              onChange={(e) => setTransportation(e.target.value)}
              //required
            >
              <option value=''>Select Transportation</option>
              <option value='public'>Public Transport</option>
              <option value='rental'>Rental Car</option>
              <option value='private'>Private Driver</option>
            </select>
          </div>

          {/* Additional Details */}
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
            <CheckCircle size={20} />{' '}
            {loading ? 'Submitting...' : 'Submit Preferences'}
          </button>
        </form>

        {error && <p className='text-red-500'>{error}</p>}
        {success && (
          <p className='text-green-500'>Preferences successfully submitted!</p>
        )}
      </div>
    </div>
  );
}

export default PreferenceModal;
