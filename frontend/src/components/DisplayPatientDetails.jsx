// import { useState } from "react";
import { aesDecrypt } from "../encryption/Aes";
import { blowfishDecrypt } from "../encryption/Blowfish";

function DisplayPatientDetails() {
  async function getSystemKey() {
    const patientSystemKey = await fetch("/getSystemKeyFromUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: "P101",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    const password = prompt("Enter password");
    const decryptedPatientSystemKey = aesDecrypt(
      password,
      blowfishDecrypt(password, patientSystemKey)
    );
    const diagnosticResults = await fetch("/getPatientDiagnostics/D101&P101", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
      console.log(diagnosticResults.symptoms);
      const decryptedSymptoms = aesDecrypt(decryptedPatientSystemKey, blowfishDecrypt(decryptedPatientSystemKey, diagnosticResults.symptoms));
      const decryptedConsultationDate = aesDecrypt(decryptedPatientSystemKey, blowfishDecrypt(decryptedPatientSystemKey, diagnosticResults.consultationDate));
      const decryptedDiagnosis = aesDecrypt(decryptedPatientSystemKey,blowfishDecrypt(decryptedPatientSystemKey, diagnosticResults.diagnosticResults));
      console.log(decryptedSymptoms, decryptedConsultationDate, decryptedDiagnosis);



  }

  return <div className="displayText">
      <button onClick={getSystemKey}>Get</button>
  </div>;
}

export default DisplayPatientDetails;
