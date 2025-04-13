
const { saveActivities, getSavedActivities } = require('../src/backend/dataCollect');

describe('Activity Data Collection', () => {
  it('should save and retrieve the selected activities correctly', () => {
    const food = [{ name: 'Pizza' }, { name: 'Sushi' }];
    const entertainment = [{ name: 'Movie' }];
    const outdoor = [{ name: 'Hiking' }, { name: 'Biking' }];

    saveActivities(food, entertainment, outdoor);

    const saved = getSavedActivities();

    expect(saved.selectedFoods).toEqual(food);
    expect(saved.selectedEntertainment).toEqual(entertainment);
    expect(saved.selectedOutdoor).toEqual(outdoor);
  });

  it('should overwrite previous selections when saveActivities is called again', () => {
    const newFood = [{ name: 'Burger' }];
    const newEntertainment = [];
    const newOutdoor = [{ name: 'Swimming' }];

    saveActivities(newFood, newEntertainment, newOutdoor);

    const saved = getSavedActivities();

    expect(saved.selectedFoods).toEqual(newFood);
    expect(saved.selectedEntertainment).toEqual(newEntertainment);
    expect(saved.selectedOutdoor).toEqual(newOutdoor);
  });
});
