// input text boxes
const InputField = ({ type, placeholder }) => {
  return (
    <>
      <div className='input-wrapper'>
        <input
          type={type}
          placeholder={placeholder}
          className='input-field'
          required
        />
      </div>
    </>
  );
};

export default InputField;
