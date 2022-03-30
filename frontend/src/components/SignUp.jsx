import { useRef, useState } from "react";

function SignUp() {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [radioButtonValue, setRadioButtonValue] = useState();
  function handleRadioChange(e){
    setRadioButtonValue(e.target.value)
  }

  function handleSubmit() {
    fetch("/signUp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: radioButtonValue,
        username: usernameRef.current.value,
        password: passwordRef.current.value
      }),
    });
  }

  return (
    <form>
      <label for="username">Username</label>
      <br />
      <input type="text" id="username" name="username" ref={usernameRef} />
      <br />
      <label for="password">Password</label>
      <br />
      <input type="text" id="password" name="password" ref={passwordRef} />
      <br />
      <input type="radio" id="doctor" name="user" value="doctor" onChange={handleRadioChange}/>
      <label for="doctor">Doctor</label>
      <input type="radio" id="patient" name="user" value="patient" onChange={handleRadioChange}/>
      <label for="patient">Patient</label>
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        Submit
      </button>
    </form>
  );
}

export default SignUp;
