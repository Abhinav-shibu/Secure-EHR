import {useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import Navbar from './Navbar';

function AdminLogin() {

  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();


  useEffect(()=>{
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? navigate("/admin/home") : navigate("/adminLogin"))
  },[])
  
  async function handleSubmit() {
    await fetch("/adminLogin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      })
      }).then(res=>res.json()).then(data=>{
        localStorage.setItem("token", data.token)
          navigate("/admin/home")
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

export default AdminLogin;
