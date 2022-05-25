import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import dp_link from "../assets/doc-patient-link.jpg"

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
      navigate("/admin/home")
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
      <div className="dp-link-body">
      <p className="doc-detail"> Assign doctors to patient </p>
      
      <form className="doc-form form-center">
      <img className=" dp-link "  src={dp_link}/>
        <div >
        <label for="pId"> Patient with Patient ID:</label>
        <input type="text" id="pId" name="patientId" ref={patientIdInputRef} />
          
        <label for="pId">  is being assigned to  doctor with Doctor ID:</label>
        <input type="text" id="dId" name="doctorId" ref={doctorIdInputRef} />

        <br />
        <br/>
        <button
        className="button"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Submit
        </button>

        <div class="loader">
                <div class="check">
                  <span class="check-one"></span>
                  <span class="check-two"></span>
                </div>
          </div>
          {/* <img className="" src={dp_link}/> */}
          </div>
        
      </form>
      
    </div>
    </div>
  );
}

export default DoctorPatientLinkAdmin;
