import React, { useEffect } from 'react';
import { useState } from 'react';
import { auth } from './components/firebase.js';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from '../src/components/Login-Components/Login.jsx';
import Signup from './components/Login-Components/Signup.jsx';
import ForgotPassword from './components/Login-Components/ForgotPassword.jsx';
import Home from './pages/Home.jsx';
import CreateTrip from './pages/CreateTrip.jsx';

export default function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <Router>
      <Routes>
        <Route path='/' element={user ? <Navigate to='/home' /> : <Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/home' element={<Home />} />
        <Route path='/createtrip' element={<CreateTrip />} />
      </Routes>
    </Router>
  );
}
