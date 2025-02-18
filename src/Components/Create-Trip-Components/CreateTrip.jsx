import React from 'react';
import InputField from '../InputField';
import LoginButton from '../Login-Components/LoginButton';

function CreateTrip() {
  return (
    <>
      <h1>Create Trip</h1>
      <div>
        <form action="#" className='form'>
          <InputField type='text' placeholder='Trip Name' />
          <InputField type='text' placeholder='Destination' />
          <InputField type='text' placeholder='Duration' />
        </form>
      </div>
      <div>
        <h2>Activities</h2>

        <div className='container'>
        <h2 className='form-title'>Entertainment</h2>
        </div>

        <div className='container'>
        <h2 className='form-title'>Food</h2>
        </div>

        <div className='container'>
        <h2 className='form-title'>Outdoor</h2>
        </div>





      </div>
    </>
  );
}

export default CreateTrip;
