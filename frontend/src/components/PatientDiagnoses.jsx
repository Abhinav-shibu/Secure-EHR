import { useRef, useState } from "react";
import { aesEncrypt, aesDecrypt } from "../encryption/Aes";
import { blowfishEncrypt, blowfishDecrypt } from "../encryption/Blowfish";
const CryptoJS = require("crypto-js");

function PatientDiagnoses() {
  const patientIdInputRef = useRef();
  const consultationDateRef = useRef();
  const symptomsRef = useRef();
  const diagnosticResultsRef = useRef();

  async function handleSubmit() {


    const patientSystemKey = await fetch("/getSystemKeyFromUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId: "D101",
        patientId: patientIdInputRef.current.value,
      }),
    }).then((response)=>response.json()).then(data=>{return data})

    const password = prompt("Enter password");
    const decryptedPatientSystemKey = aesDecrypt(password,blowfishDecrypt(password, patientSystemKey));

    const consultationDate = blowfishEncrypt(decryptedPatientSystemKey, aesEncrypt(decryptedPatientSystemKey, consultationDateRef.current.value));
    const symptoms = blowfishEncrypt(decryptedPatientSystemKey, aesEncrypt(decryptedPatientSystemKey, symptomsRef.current.value));
    const diagnosticResults = blowfishEncrypt(decryptedPatientSystemKey, aesEncrypt(decryptedPatientSystemKey, diagnosticResultsRef.current.value));
   

    fetch("/D101/addDiagnosis", {
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
    });
  }

  return (
    <div>
      <form>
        <label for="pId">Patient ID:</label>
        <br />
        <input type="text" id="pId" name="patientId" ref={patientIdInputRef} />
        <br />
        <label for="consultationDate">Consultation Date</label>
        <input
          type="date"
          name="consultationDate"
          id="consultationDate"
          ref={consultationDateRef}
        />
        <label for="symptoms">Symptoms</label>
        <textarea
          name="symptoms"
          id="symptoms"
          cols="30"
          rows="10"
          ref={symptomsRef}
        ></textarea>
        <label for="diagnosticResults">Diagnostic Results</label>
        <textarea
          name="diagnosticResults"
          id="diagnosticResults"
          cols="30"
          rows="10"
          ref={diagnosticResultsRef}
        ></textarea>
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

export default PatientDiagnoses;
