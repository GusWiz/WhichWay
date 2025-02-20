// Temp file
// testing login functionality
import { signOut } from 'firebase/auth';
import { auth } from '../Components/firebase';
import '../static/HomeBody.css';

function Home() {
  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  };
  return (
  <div>
    <h2>You are logged in to homepage!</h2>
    <button onClick={logout}> Logout </button>

    <main className="home-body">
      <div className="option-boxes">
        <button onClick={() => history.push('/create-trip')}>Create New Trip</button>
        <div class="option-boxes">
          <button onclick="location.href''">Create New Trip</button>
          <button onclick="location.href''">Load Existing Trip</button>
        </div>
        <button onClick={() => history.push('/load-trip')}>Load Existing Trip</button>
      </div>
    </main>
  </div>
  );
}

export default Home;
