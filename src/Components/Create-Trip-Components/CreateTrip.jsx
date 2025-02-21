import React from 'react';
import InputField from '../InputField';
import LoginButton from '../Login-Components/LoginButton';


function ChangeBudget(){

}

function CreateTrip() {
  return (
    <>
      <h1>Create Trip</h1>
      <div>
        <form action='#' className='form'>
          <InputField type='text' placeholder='Trip Name' />
          <InputField type='text' placeholder='Destination' />
          <InputField type='text' placeholder='Duration' />
        </form>
        <label>Budget = </label><label id='displayedBudget'>null</label>
        <form action='#' classname='form'>
          <input type='text' placeholder='Budget' id='budgetInput'/>
          <button type='submit' placeholder='submit'>BRUH</button>
        </form>

      </div>
      <div>
        <h2>Activities</h2>

        <div className='container'>
          <h2 className='form-title'>Entertainment</h2>
          <div className='selectable-container'>
            <label className='selectable-label'>
              <input type='radio' name='entertainment' value='movie' />
              Movie
            </label>
            <label className='selectable-label'>
              <input type='radio' name='entertainment' value='concert' />
              Concert
            </label>
            <label className='selectable-label'>
              <input type='radio' name='entertainment' value='theater' />
              Theater
            </label>
          </div>
        </div>

        <div className='container'>
          <h2 className='form-title'>Food</h2>
          <div className='selectable-container'>
            <label className='selectable-label'>
              <input type='radio' name='food' value='Chilis' />
              Chilis
            </label>
            <label className='selectable-label'>
              <input type='radio' name='food' value='Grimaldis' />
              Grimaldis
            </label>
            <label className='selectable-label'>
              <input type='radio' name='food' value='McDonalds' />
              McDonalds
            </label>
          </div>
        </div>

        <div className='container'>
          <h2 className='form-title'>Outdoor</h2>
          <div className='selectable-container'>
            <label className='selectable-label'>
              <input type='radio' name='outdoor' value='Gustavo Hiking Trail' />
              Gustavo Hiking Trail
            </label>
            <label className='selectable-label'>
              <input type='radio' name='outdoor' value='Vinny Rosy River' />
              Vinny Rosy River
            </label>
            <label className='selectable-label'>
              <input
                type='radio'
                name='outdoor'
                value='Alan De Le Torre Lake'
              />
              Alan De Le Torre Lake
            </label>
          </div>
        </div>

        <LoginButton text='Create Itinerary' />
      </div>
    </>
  );
}

export default CreateTrip;
