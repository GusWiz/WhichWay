import './login-styling.css';
const LoginButton = ({ text }) => {
  return (
    <button type='submit' className='abutton'>
      {text}
    </button>
  );
};

export default LoginButton;
