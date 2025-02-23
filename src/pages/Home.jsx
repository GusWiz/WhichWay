// testing login functionality
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';

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
    <>
      <h2>You are logged in to homepage!</h2>
      <button onClick={logout}> Logout </button>
    </>
  );
}

export default Home;
