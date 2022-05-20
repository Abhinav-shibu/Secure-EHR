import {useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import Navbar from './Navbar';

function Login() {

  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [radioButtonValue, setRadioButtonValue] = useState();

  function handleRadioChange(e) {
    setRadioButtonValue(e.target.value);
  }

  useEffect(()=>{
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn && data.user.username!=="admin" ? navigate("/doctor/home") : navigate("/"))
  },[])
  
  async function handleSubmit() {
    await fetch("/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        user: radioButtonValue,
      })
      }).then(res=>res.json()).then(data=>{
        localStorage.setItem("token", data.token)
        if(radioButtonValue==="doctor"){
          navigate("/doctor/home")
        }
        else{
          navigate("/patient/home")
        }
    })
  }

  return (
    <div className="wrapper fadeInDown">
      <Navbar />
      <div id="formContent">
        <div className="fadeIn first">
          <img
            src="http://danielzawadzki.com/codepen/01/icon.svg"
            id="icon"
            alt="User Icon"
          />
        </div>
        <form>
          <input
            type="text"
            id="username"
            className="fadeIn second"
            name="username"
            placeholder="username"
            ref={usernameRef}
          />
          <input
            type="text"
            id="password"
            className="fadeIn third"
            name="password"
            placeholder="password"
            ref={passwordRef}
          />
          <input
            type="radio"
            id="doctor"
            name="user"
            value="doctor"
            onChange={handleRadioChange}
          />
          <label for="doctor">Doctor</label>
          <input
            type="radio"
            id="patient"
            name="user"
            value="patient"
            onChange={handleRadioChange}
          />
          <label for="patient">Patient</label>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Log In
          </button>
        </form>

        <div id="formFooter">
          <a className="underlineHover" href="">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
