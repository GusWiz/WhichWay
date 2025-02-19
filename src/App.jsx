import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './Components/Login-Components/Login.jsx';
import Signup from './components/Login-Components/Signup.jsx';
import ForgotPassword from './components/Login-Components/ForgotPassword.jsx';
import EnterVerificationCode from './components/Login-Components/EnterVerificationCode.jsx';
import ResetPassword from './components/Login-Components/ResetPassword.jsx';
import app from './Components/firebase.js';

export default function App() {
  // const [user, setUser] = useState();
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     setUser(user);
  //   })
  // });

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}
