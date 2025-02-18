import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login-Components/Login';
import Signup from './components/Login-Components/Signup';

import ForgotPassword from './components/Login-Components/ForgotPassword.jsx';
import EnterVerificationCode from './components/Login-Components/EnterVerificationCode.jsx';
import ResetPassword from './components/Login-Components/ResetPassword.jsx';

function App() {
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
        <Route path='/' element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
