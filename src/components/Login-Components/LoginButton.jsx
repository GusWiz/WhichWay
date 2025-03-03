import './login-styling.css';
const LoginButton = ({ text }) => {
  return (
    <button type='submit' className='button'>
      {text}
    </button>
  );
};

export default LoginButton;
