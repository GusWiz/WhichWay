import './login-styling.css';
const SocialLogin = ({ onClick }) => {
  return (
    <div className='social-login'>
      <button className='social-button' onClick={() => onClick()}>
        <img
          src='./src/assets/google.svg'
          atl='Google'
          className='social-icon'
        />
        Google
      </button>
    </div>
  );
};

export default SocialLogin;
