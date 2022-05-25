import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aesEncrypt, aesDecrypt } from "../encryption/Aes";
import { blowfishEncrypt, blowfishDecrypt } from "../encryption/Blowfish";
import Navbar from "./Navbar";

function PatientDiagnoses() {
  const patientIdInputRef = useRef();
  const consultationDateRef = useRef();
  const symptomsRef = useRef();
  const diagnosticResultsRef = useRef();
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [patientList, setPatientList] = useState([]);
  
  async function getPatientList() {
    console.log("func plist");
    await fetch("/getPatientList", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId: username,
      }),
    }).then((response)=>response.json()).then(data=>{
      setPatientList(data);
    })
  }

  useEffect(()=>{
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? setUsername(data.username) : navigate("/"))
    // console.log("Check");
    // getPatientList();
    // console.log(patientList);
    
  },[])


    
  async function handleSubmit() {
    const patientSystemKey = await fetch("/getSystemKeyFromUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId: username,
        patientId: patientIdInputRef.current.value,
      }),
    })
    .then((response)=>response.json()).then(data=>{
      return data;
    })
    let encryptedPatientSystemKey=null;
    for(let i=0;i<patientSystemKey.length;i++){
      if(patientSystemKey[i].patientId===patientIdInputRef.current.value){
          encryptedPatientSystemKey=patientSystemKey[i].encryptedPatientSystemKey
      }
    }
    const password = prompt("Enter password");
    const decryptedPatientSystemKey = aesDecrypt(password,blowfishDecrypt(password, encryptedPatientSystemKey));

    const consultationDate = blowfishEncrypt(decryptedPatientSystemKey, aesEncrypt(decryptedPatientSystemKey, consultationDateRef.current.value));
    const symptoms = blowfishEncrypt(decryptedPatientSystemKey, aesEncrypt(decryptedPatientSystemKey, symptomsRef.current.value));
    const diagnosticResults = blowfishEncrypt(decryptedPatientSystemKey, aesEncrypt(decryptedPatientSystemKey, diagnosticResultsRef.current.value));
 
    const blockchainId = await fetch("/mineBlock", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: patientIdInputRef.current.value,
        consultationDate: consultationDate,
        symptoms: symptoms,
        diagnosticResults: diagnosticResults
      }),
    }).then((response) => response.json())
      .then((data) => {
        return data;
      });

     fetch(`/${username}/addDiagnosis`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: patientIdInputRef.current.value,
        consultationDate: consultationDate,
        symptoms: symptoms,
        diagnosticResults: diagnosticResults,
        blockchainId: blockchainId
      }),
    });
    navigate("/doctor/home")
  }

  return (
    
    <div className="dia-body">
      <Navbar />
      <div >
      <h2 className="dia-header">Patient Diagnosis</h2>
      <button
          className="btn btn-dark get_patient"
          type="submit"
          onClick={getPatientList}
        >
          Get Patients
        </button>
      <form>

        <label for="pId">Patient ID:</label>
        <br />
        <select className="dropdown" name="pId" id="pId" ref={patientIdInputRef}>
          {patientList.map((value,index) => {
            return <option value={value.patientId}>{value.patientId}</option>
          })}
        </select>
        {/* <input type="text" id="pId" name="patientId" ref={patientIdInputRef} /> */}
        <br />

      <div className="dia-box1">

        <label  className="diagnosis" for="consultationDate">Consultation Date</label>
        <input 
          classNanme="dia-box"
          type="date"
          name="consultationDate"
          id="consultationDate"
          ref={consultationDateRef}
        />
      </div>

      <div className="dia-box2" >
        <label  className="diagnosis" for="symptoms">Symptoms</label>
        <textarea
          name="symptoms"
          id="symptoms"
          cols="40"
          rows="5"
          ref={symptomsRef}
        ></textarea>

      </div>

      <div className="dia-box" >
        <label  className="diagnosis" for="diagnosticResults">Diagnostic Results</label>
        <textarea
          name="diagnosticResults"
          id="diagnosticResults"
          cols="40"
          rows="5"
          ref={diagnosticResultsRef}
        ></textarea>

      </div>

        <button className="btn btn-dark  butt butt-pos"
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
    </div>

    
  );
}

export default PatientDiagnoses;
