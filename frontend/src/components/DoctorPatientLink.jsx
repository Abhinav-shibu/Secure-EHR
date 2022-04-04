import { useRef, useState } from "react";
import { aesEncrypt } from "../encryption/Aes";
import { blowfishEncrypt } from "../encryption/Blowfish";
const CryptoJS = require("crypto-js");

function DoctorPatientLink() {
  const patientIdInputRef = useRef();

  async function handleSubmit() {

    const patientId = patientIdInputRef.current.value;


    const patientSystemKey = await fetch("/getSystemKey", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: patientId
      })
    }).then((response)=>response.json()).then(data=>{return data})
    const username = prompt("Enter username");
        const password = prompt("Enter password");
        const result = await fetch("/check", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                user: "doctor"
            })
        }).then((response)=>response.json()).then(data=>{return data})
        console.log(result);
        if (result === "False") {
            alert("Wrong Password");
        }
        else{
    const encryptedPatientSystemKey = blowfishEncrypt(password, aesEncrypt(password, patientSystemKey));

        fetch("/addPatientDoctorLink/D101", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // systemKey: patientSystemKey,
                encryptedPatientSystemKey: encryptedPatientSystemKey,
                patientId: patientId,
            })
        })}
  }

  return (
    <div>
      <form>
        <label for="pId">Patient ID:</label>
        <br />
        <input type="text" id="pId" name="patientId" ref={patientIdInputRef} />
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

export default DoctorPatientLink;
