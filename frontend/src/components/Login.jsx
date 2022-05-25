import {useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import Navbar from './Navbar';
import doctor from "../assets/doc.png";
import patient from "../assets/patient.png";

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
    .then(data => data.isLoggedIn ? navigate("/doctor/home") : navigate("/"))
  },[])
  
  async function handleSubmit() {
    console.log("hello");
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
        console.log(data);
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
    <div className='default1'> 
    <div className="wrapper fadeInDown ">
      <Navbar />
      <div className='form'>

      <div id="formContent" className="form-body">
        
        <form>
        <label className="form__label"  for="username">Username</label>  
        <br />
          <input 
            type="text"
            id="username"
            className="fadeIn second form__input "
            name="username"
            placeholder="username"
            ref={usernameRef}
          />
          <br />
          <label  className="form__label" for="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            className="fadeIn third form__input"
            name="password"
            placeholder="password"
            ref={passwordRef}
          />
          <br />
          {/* <input
            type="radio"
            id="doctor"
            name="user"
            value="doctor"
            onChange={handleRadioChange}
          /> */}
          <label className="form__label"  for="doctor">
          <img class="doctor hvr-sink " src={doctor}/>
          <input
            type="radio"
            id="doctor"
            name="user"
            value="doctor"
            onChange={handleRadioChange}
          />
           <p>doctor</p>
           </label>


          <label className="form__label"  for="patient">
          <img class="patient hvr-sink " src={patient}/>
          <input type="radio" id="patient"  name="user" value="patient" onChange={handleRadioChange}>
          </input>
          <p>patient</p>
           </label>
           <br/>
          <button className='btn btn-dark'
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
    </div>
    </div>

  );
}

export default Login;
