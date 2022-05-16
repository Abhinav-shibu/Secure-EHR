import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function DoctorPatientLinkAdmin() {
  const patientIdInputRef = useRef();
  const doctorIdInputRef = useRef();

  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit() {

    const patientId = patientIdInputRef.current.value;
    const doctorId = doctorIdInputRef.current.value;


    // const patientSystemKey = await fetch("/getSystemKey", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     patientId: patientId,
    //     doctorId
    //   })
    // }).then((response)=>response.json()).then(data=>{return data})
    //     const password = prompt("Enter password");
    //     const result = await fetch("/check", {
    //         method: "POST",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             username: username,
    //             password: password,
    //             user: "doctor"
    //         })
    //     }).then((response)=>response.json()).then(data=>{return data})
    //     console.log(result);
    //     if (result === "False") {
    //         alert("Wrong Password");
    //     }
    //     else{
    // const encryptedPatientSystemKey = blowfishEncrypt(password, aesEncrypt(password, patientSystemKey));

        fetch(`/addPatientDoctorLink/${doctorId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // systemKey: patientSystemKey,
                // encryptedPatientSystemKey: encryptedPatientSystemKey,
                patientId: patientId,
            })
        })
      // }
  }

  useEffect(()=>{
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? setUsername(data.username) : navigate("/"))
  },[])

  return (
    <div>
      <Navbar />
      <form>
        <label for="pId">Patient ID:</label>
        <br />
        <input type="text" id="pId" name="patientId" ref={patientIdInputRef} />
        <br />
        <label for="pId">Doctor ID:</label>
        <br />
        <input type="text" id="dId" name="doctorId" ref={doctorIdInputRef} />
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

export default DoctorPatientLinkAdmin;
