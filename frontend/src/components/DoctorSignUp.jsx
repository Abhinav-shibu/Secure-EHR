import { useRef, useState } from "react";
import Navbar from "./Navbar";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import doctor from "../assets/doc.png";
import patient from "../assets/patient.png";
// import hospital from "../assets/hospital.jpg";

function SignUp() {
  const usernameRef = useRef();
  const passwordRef = useRef();

  function handleSubmit() {
    fetch("/signUp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: "doctor",
        username: usernameRef.current.value,
        password: passwordRef.current.value
      }),
    });
  }

  
  return (
    <div className="default1"> 
    
    <Navbar />

    <div className="form">
    <div className="form-body ">
    <form>
      <label className="form__label"  for="username">Username</label>
      <br />
      <input   className="form__input" type="text" id="username" name="username" placeholder="username" ref={usernameRef} />
      <br />
      <label  className="form__label" for="password">Password</label>
      <br />
      <input  className="form__input" type="password" id="password" name="password" placeholder="password"  ref={passwordRef} />
      <br />
      
      {/* <label className="form__label"  for="doctor">
      <input type="radio" id="doctor"  name="user" value="doctor" onChange={handleRadioChange}/>
      <img class="doctor hvr-sink" src={doctor}/>
      <p>doctor</p>
           </label>
      <label className="form__label"  for="patient">            
      <img class="patient hvr-sink " src={patient}/>

      <input type="radio" id="patient"  name="user" value="patient" onChange={handleRadioChange}>
      </input>
      <p>patient</p> */}
{/* </label> */}

      
      
           
      {/* <input  className="form__input" type="radio" id="patient" name="user" value="patient" onChange={handleRadioChange}/>

      <label  className="form__label" for="patient">Patient</label> */}
      <div > 
        <button  className=" btn btn-dark "
        type="submit "
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        Sign Up
      </button>
    </div>
      
    </form>
    </div>
    </div>
    </div>
  );
}

export default SignUp;
