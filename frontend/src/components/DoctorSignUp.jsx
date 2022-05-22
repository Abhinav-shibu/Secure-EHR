import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function SignUp() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();


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
    navigate("/admin/home")
  }

  return (
    <div>
    <Navbar />
    <form>
      <label for="username">Username</label>
      <br />
      <input type="text" id="username" name="username" ref={usernameRef} />
      <br />
      <label for="password">Password</label>
      <br />
      <input type="text" id="password" name="password" ref={passwordRef} />
      <br />

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
    </div>
  );
}

export default SignUp;
