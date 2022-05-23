import {useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import Navbar from './Navbar';
import login from "../assets/login.png"
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
    .then(data => data.isLoggedIn && data.user.username==="admin" ? navigate("/admin/home") : navigate("/adminLogin"))
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
     
        <p className='ad-login'>Login</p>
        <br/>
        <div className='img-box'>
          <img classname="login-img" src={login}></img>
        </div>

      
      <div id="formContent">
        {/* <div className="fadeIn first">
          <img
            src="http://danielzawadzki.com/codepen/01/icon.svg"
            id="icon"
            alt="User Icon"
          />
        </div> */}
      <div className='form f1'>
      <div className='form-body '>
        <form>
        <label className="form__label"  for="username">Username</label>
        <br/>
          <input
            
            type="text"
            id="username"
            className=" form__input "
            name="username"
            placeholder="username"
            ref={usernameRef}
          />
          <br/>
            <label  className="form__label" for="password">Password</label>
            <br />
            
          <input
            type="text"
            id="password"
            className=" form__input"
            name="password"
            placeholder="password"
            ref={passwordRef}
          />
          <br />
          <br/>
          <button
            className='btn btn-dark'
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Log In
          </button>
        </form>
        </div>
        

        <div id="formFooter">
          <a className="underlineHover" href="">
            Forgot Password?
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
