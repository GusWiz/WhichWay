// import React from 'react';
import React, { useEffect } from 'react';
import ItineraryCalendar from '../components/Universal-Components/ItineraryDisplay';

// export const sampleSchedule = [
//   {
//     date: '2025-04-14',
//     activities: [
//       {
//         name: 'Visit Museum',
//         start_time: '09:00 AM',
//         end_time: '11:00 AM',
//         Duration: '1 Day',
//       },
//       {
//         name: 'Lunch at Central Cafe',
//         start_time: '12:00 PM',
//         end_time: '1:00 PM',
//         Duration: '1 Hour',
//       },
//     ],
//   },
//   {
//     date: '2025-04-15',
//     activities: [
//       {
//         name: 'Hiking at Green Trail',
//         start_time: '08:00 AM',
//         end_time: '2:00 PM',
//         Duration: '4 Hours',
//       },
//     ],
//   },
// ];
export const sampleSchedule = [
  {
    date: '2025-04-20', // Sunday
    activities: [
      {
        name: 'Nature Walk',
        start_time: '9:00 AM',
        end_time: '11:00 AM',
      },
    ],
  },
  {
    date: '2025-04-21', // Monday
    activities: [
      {
        name: 'Design Sprint',
        start_time: '10:00 AM',
        end_time: '12:00 PM',
      },
    ],
  },
  {
    date: '2025-04-22', // Tuesday
    activities: [
      {
        name: 'Workout Session',
        start_time: '8:00 AM',
        end_time: '9:30 AM',
      },
    ],
  },
  {
    date: '2025-04-23', // Wednesday
    activities: [
      {
        name: 'Deep Work Block',
        start_time: '1:00 PM',
        end_time: '3:00 PM',
      },
    ],
  },
  {
    date: '2025-04-24', // Thursday
    activities: [
      {
        name: 'Team Sync',
        start_time: '2:00 PM',
        end_time: '3:30 PM',
      },
    ],
  },
  {
    date: '2025-04-25', // Friday
    activities: [
      {
        name: 'Demo Prep',
        start_time: '11:00 AM',
        end_time: '12:00 PM',
      },
      {
        name: 'Sprint Review',
        start_time: '4:00 PM',
        end_time: '5:30 PM',
      },
    ],
  },
  {
    date: '2025-04-26', // Saturday
    activities: [
      {
        name: 'Family Game Night',
        start_time: '6:00 PM',
        end_time: '8:00 PM',
      },
    ],
  },
];

const testPage = (schedule, tripName) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 200); // wait 500ms before printing

    return () => clearTimeout(timer); // clean up the timer if the component unmounts
  }, []);

  // const handlePrint = () => {
  //   window.print()
  // }

  return (
    <div>
      <h1 style={{ display: 'flex', justifyContent: 'center' }}>Itinerary</h1>

      <ItineraryCalendar schedule={sampleSchedule} />
    </div>
  );
};
export default testPage;
