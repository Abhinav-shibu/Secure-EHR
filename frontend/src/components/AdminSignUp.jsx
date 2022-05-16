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

export default AdminSignUp;
