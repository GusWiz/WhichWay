import React, { useState } from 'react';
import InputField from '../components/InputField';
import LoginButton from '../components/Login-Components/LoginButton';


function ChangeBudget(){

}



function CreateTrip() {
  const [details, setDetails] = useState({
    budget: ""
  })
  const[displayedBudget, setDisplayedBudget] = useState({
    budget: ""
  })

  const handleChange = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setDetails((prev) => {
      return {...prev, [name]: value}
    })
    // console.log(details);
  }
  const budgetSubmit = (event) =>{
    event.preventDefault();
    setDisplayedBudget((prev) => {
      return {...prev, budget: details.budget}
    })
    console.log(details);
  }

  return (
    <>
      <h1>Create Trip</h1>
      <div>
        <form action='#' className='form'>
          <InputField type='text' placeholder='Trip Name' />
          <InputField type='text' placeholder='Destination' />
          <InputField type='text' placeholder='Duration' />
        </form>
        <label>Budget = $</label><label id='displayedBudget'>{displayedBudget.budget}</label>
        <form action='#' className='form' onSubmit={budgetSubmit}>
          <input type='number' name='budget' placeholder='Budget' id='budgetInput' onChange={handleChange}/>
          <button type='submit'>Button</button>
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
