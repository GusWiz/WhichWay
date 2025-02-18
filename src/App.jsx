import Login from './components/Login-Components/Login.jsx';
import Signup from './components/Login-Components/Signup.jsx';
import ForgotPassword from './components/Login-Components/ForgotPassword.jsx';
import EnterVerificationCode from './components/Login-Components/EnterVerificationCode.jsx';
import ResetPassword from './components/Login-Components/ResetPassword.jsx';
import Navbar from './Components/Page-Components/Navbar.jsx';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' />
      </Switch>
    </Router>
    </>
  );
}

export default App;
