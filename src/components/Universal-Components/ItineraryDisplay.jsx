import React from 'react';
import './ItineraryDisplay.css';

const formatHour = (hour) => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${ampm}`;
};

const getWeekday = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getMinutesFromTime = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

const getScheduleTimeRange = (schedule) => {
  let earliest = Infinity;
  let latest = -Infinity;

  schedule.forEach((day) => {
    day.activities.forEach((activity) => {
      const start = getMinutesFromTime(activity.start_time);
      const end = getMinutesFromTime(activity.end_time);
      if (start < earliest) earliest = start;
      if (end > latest) latest = end;
    });

  });



  return { startMinutes: earliest, endMinutes: latest };
};

const ItineraryDisplay = ({ schedule }) => {
  const { startMinutes, endMinutes } = getScheduleTimeRange(schedule);
  const totalSpanMinutes = (endMinutes - startMinutes) + 60;

  // Fixed container height (can adjust for printing)
  const containerHeight = 600;

  // Calculate pixels per minute
  const pixelsPerMinute = containerHeight / totalSpanMinutes;

  // Create hour labels (every full hour)
  const hourLabels = [];
  for (let mins = startMinutes; mins <= endMinutes; mins += 60) {
    hourLabels.push(mins);
  }

  return (
    <div className='itinerary-grid-wrapper'>
      {/* Header Row */}
      <div className='header-row'>
        <div className='time-column-header' />
        {schedule.map((day, idx) => (
          <div key={idx} className='day-column-header'>
            <div className='weekday'>{getWeekday(day.date)}</div>
            <div className='date'>{day.date}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className='grid-content'>
        {/* Time Labels */}
        <div className='time-column' style={{ height: `${containerHeight}px` }}>
          {hourLabels.map((minutes) => (
            <div
              key={minutes}
              className='time-slot'
              style={{ height: `${60 * pixelsPerMinute}px` }}
            >
              {formatHour(Math.floor(minutes / 60))}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        <div className='days-container'>
          {schedule.map((day, idx) => (
            <div key={idx} className='day-column'>
              <div className='day-body' style={{ height: `${containerHeight}px` }}>
                {day.activities.map((activity, i) => {
                  const start = getMinutesFromTime(activity.start_time);
                  const end = getMinutesFromTime(activity.end_time);

                  // Calculate the top position of the activity block
                  const top = (start - startMinutes) * pixelsPerMinute;

                  // Calculate the height of the activity block
                  const height = (end - start) * pixelsPerMinute;

                  return (
                    <div
                      key={i}
                      className='activity-block'
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <strong>{activity.name}</strong>
                      <div>
                        {activity.start_time} - {activity.end_time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
