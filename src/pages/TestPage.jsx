import React from 'react';
import ItineraryCalendar from '../components/Universal-Components/ItineraryDisplay';

const sampleSchedule = [
  {
    date: '2025-04-14',
    activities: [
      {
        name: 'Visit Museum',
        start_time: '09:00',
        end_time: '11:00',
        Duration: '1 Day',
      },
      {
        name: 'Lunch at Central Cafe',
        start_time: '12:00',
        end_time: '13:00',
        Duration: '1 Hour',
      },
    ],
  },
  {
    date: '2025-04-15',
    activities: [
      {
        name: 'Hiking at Green Trail',
        start_time: '08:00',
        end_time: '12:00',
        Duration: '4 Hours',
      },
    ],
  },
];

const testPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 py-10'>
      <h1 className='text-3xl font-bold text-center mb-8'>Test Itinerary</h1>
      <ItineraryCalendar schedule={sampleSchedule} />
    </div>
  );
};

export default testPage;
