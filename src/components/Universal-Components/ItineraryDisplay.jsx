// ItineraryCalendar.jsx
import React from 'react';

const ItineraryCalendar = ({ schedule }) => {
  return (
    <div className='p-4'>
      {schedule.map((day, idx) => (
        <div key={idx} className='mb-6 border rounded-lg p-4 shadow'>
          <h2 className='text-xl font-bold mb-2'>{day.date}</h2>
          <div className='space-y-2'>
            {day.activities.map((activity, i) => (
              <div
                key={i}
                className='bg-blue-100 border-l-4 border-blue-500 p-3 rounded'
              >
                <p className='font-semibold'>{activity.name}</p>
                <p>
                  {activity.start_time} - {activity.end_time}
                </p>
                <p>Duration: {activity.Duration}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryCalendar;
