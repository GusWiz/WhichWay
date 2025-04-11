// Define the object and function to test
const tripDetails = {};

function saveDetails(name, destination, duration, startDate, endDate) {
  tripDetails.name = name;
  tripDetails.destination = destination;
  tripDetails.duration = duration;
  tripDetails.startDate = startDate;
  tripDetails.endDate = endDate;
}

describe('saveDetails', () => {
  beforeEach(() => {
    for (const key in tripDetails) delete tripDetails[key];
  });

  test('saves all trip details into tripDetails object', () => {
    const testInput = {
      name: 'John',
      destination: 'Paris',
      duration: 7,
      startDate: '2025-06-01',
      endDate: '2025-06-08',
    };

    saveDetails(
      testInput.name,
      testInput.destination,
      testInput.duration,
      testInput.startDate,
      testInput.endDate
    );

    expect(tripDetails).toEqual(testInput);
  });
});
