import { useRef, useState } from "react";
import Navbar from "./Navbar";

function AdminSignUp() {
  const usernameRef = useRef();
  const passwordRef = useRef();

  function handleSubmit() {
    fetch("/adminSignUp", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value
      }),
    });
  }

  return (
    <div>
    <Navbar />
    <div className="wrapper">
    <p className="ad_signup"> Admin Sign Up</p>
    <div className="form form-admin"> 
    <div className="form-body">
    <form>
      <label className="form__label" for="username">Username</label>
      <br />
      <input  className="form__input" type="text" id="username" name="username" ref={usernameRef} />
      <br />
      <label className="form__label" for="password">Password</label>
      <br />
      <input  className="form__input" type="text" id="password" name="password" ref={passwordRef} />
      <br />
      <br/>
      <div >
      <button
      className="btn btn-dark"
        type="submit"
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
    </div>
  );
}

export default AdminSignUp;
