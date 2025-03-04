import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import './PreferenceModal.css';

function PreferenceModal({ onClose }) {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [activities, setActivities] = useState('');
  const [food, setFood] = useState('');
  const [moreDetails, setMoreDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, save data or perform any action.
    console.log({ destination, dates, activities, food, moreDetails });
    onClose(); // Close the modal after submit
  };

  return (
    <div className="fixed bg-black backdrop-blur-sm">
      <div className="bg-white rounded-xl px-8 py-10 flex flex-col gap-5 items-center w-full">
        <button className="place-self-end" onClick={onClose}>
          <X size={30} />
        </button>

        <h1 className="text-2xl font-bold text-center">Plan Your Itinerary</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Destination */}
          <div className="flex flex-col">
            <label htmlFor="destination" className="text-lg">Where are you going?</label>
            <input
              type="text"
              id="destination"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Dates */}
          <div className="flex flex-col">
            <label htmlFor="dates" className="text-lg">Enter travel dates</label>
            <input
              type="text"
              id="dates"
              placeholder="Enter start and end dates"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              required
            />
          </div>

          {/* Activities */}
          <div className="flex flex-col">
            <label htmlFor="activities" className="text-lg">What activities are you interested in?</label>
            <input
              type="text"
              id="activities"
              placeholder="Enter your activities"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
            />
          </div>

          {/* Foods */}
          <div className="flex flex-col">
            <label htmlFor="food" className="text-lg">Any foods you're interested in?</label>
            <input
              type="text"
              id="food"
              placeholder="Enter food preferences"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
          </div>

          {/* More Details */}
          <div className="flex flex-col">
            <label htmlFor="moreDetails" className="text-lg">More details (optional)</label>
            <textarea
              id="moreDetails"
              placeholder="Add any additional details"
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex justify-center items-center gap-2">
            <CheckCircle size={20} /> Submit Itinerary
          </button>
        </form>
      </div>
    </div>
  );
}

export default PreferenceModal;

