import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { aesDecrypt } from "../encryption/Aes";
import { blowfishDecrypt } from "../encryption/Blowfish";
import Navbar from "./Navbar";

function DisplayPatientDetails() {
  
  const navigate = useNavigate();
  const [username, setUsername] = useState();  
  // const [patientName, setPatientName] = useState();
  // const [doctorName, setDoctorName] = useState();

  useEffect(()=>{
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? (setUsername(data.username) ,handleSubmit()) : navigate("/"))
  })

  async function handleSubmit() {
    let decryptedPatientSystemKey = null;
    let keyInKeyValuePair = null;    
    if (username[0] === "P") {
      keyInKeyValuePair = { patientId: username };
    } else {
      keyInKeyValuePair = { doctorId: username };
    }
    const patientSystemKey = await fetch("/getSystemKeyFromUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keyInKeyValuePair),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    const password = prompt("Enter password");
    if (username[0] === "P") {
      decryptedPatientSystemKey = aesDecrypt(
        password,
        blowfishDecrypt(password, patientSystemKey)
      );
    }

    const diagnosticResultsList = await fetch("/getPatientDiagnostics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keyInKeyValuePair),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    for (const diagnosticResults of diagnosticResultsList) {
      if (username[0] === "D") {
        for(let i =0;i<patientSystemKey.length;i++){
          if (patientSystemKey[i].patientId === diagnosticResults.patientId) {
            decryptedPatientSystemKey = aesDecrypt(
              password,
              blowfishDecrypt(password, patientSystemKey[i].encryptedPatientSystemKey)
            );
              // setPatientName(
              //   await fetch("/getNameFromId", {
              //     method: "POST",
              //     headers: {
              //       Accept: "application/json",
              //       "Content-Type": "application/json",
              //     },
              //     body: JSON.stringify({patientId: patientSystemKey[i].patientId}),
              //   })
              //     .then((response) => response.json())
              //     .then((data) => {
              //       return data;
              //     })
              // )
            break;
          }
        }
      }
      
      const result = await fetch("/compareHash", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: diagnosticResults.patientId,
          consultationDate: diagnosticResults.consultationDate,
          symptoms: diagnosticResults.symptoms,
          diagnosticResults: diagnosticResults.diagnosticResults,
          blockchainId: diagnosticResults.blockchainId
        })
      })
      .then(res => res.json())
      .then(data =>  { return(data) })

      if(result==="Success"){
        const decryptedSymptoms = aesDecrypt(
          decryptedPatientSystemKey,
          blowfishDecrypt(decryptedPatientSystemKey, diagnosticResults.symptoms)
        );
        const decryptedConsultationDate = aesDecrypt(
          decryptedPatientSystemKey,
          blowfishDecrypt(
            decryptedPatientSystemKey,
            diagnosticResults.consultationDate
          )
        );
        const decryptedDiagnosis = aesDecrypt(
          decryptedPatientSystemKey,
          blowfishDecrypt(
            decryptedPatientSystemKey,
            diagnosticResults.diagnosticResults
          )
        );
        console.log(
          diagnosticResults.patientId,
          "\n",
          decryptedSymptoms,
          "\n",
          decryptedConsultationDate,
          "\n",
          decryptedDiagnosis,
          "\n",
          result,
          "\n"
        );
      }
      else if(result==="Failure"){
        console.log("Data Altered for " + diagnosticResults.patientId);
      }
    
      
    }
  }

  return (
    <div className="displayText">
      <Navbar />    
    </div>
  );
}

export default DisplayPatientDetails;
