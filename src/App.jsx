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
import CreateItinerary from './pages/CreateItinerary.jsx';
import Landing from './pages/Landing.jsx';
import Settings from './pages/Settings.jsx';
import Account from './pages/Account.jsx';
import EditTrip from './pages/EditTrip.jsx';
import ExportItinerary from './pages/ExportItinerary.jsx';

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
        <Route
          path='/'
          element={user ? <Navigate to='/home' /> : <Landing />}
        />
        <Route path='/landing' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/home' element={user ? <Home /> : <Login />} />
        <Route path='/createtrip' element={user ? <CreateTrip /> : <Login />} />
        <Route
          path='/createitinerary'
          element={user ? <CreateItinerary /> : <Login />}
        />
        <Route
          path='/account'
          element={user ? <Account user={user} /> : <Login />}
        />
        <Route path='/settings' element={user ? <Settings /> : <Login />} />
        <Route path='/edittrip' element={user ? <EditTrip /> : <Login />} />
        <Route path='/export' element={<ExportItinerary />} />
      </Routes>
    </Router>
  );
}
