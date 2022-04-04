import { useState, useRef } from "react";
import { aesDecrypt } from "../encryption/Aes";
import { blowfishDecrypt } from "../encryption/Blowfish";

function DisplayPatientDetails() {
  const [radioButtonValue, setRadioButtonValue] = useState();
  const docpatIdRef = useRef();

  function handleRadioChange(e) {
    setRadioButtonValue(e.target.value);
  }

  async function handleSubmit() {
    let decryptedPatientSystemKey = null;
    let keyInKeyValuePair = null;
    if (radioButtonValue === "patient") {
      keyInKeyValuePair = { patientId: docpatIdRef.current.value };
    } else {
      keyInKeyValuePair = { doctorId: docpatIdRef.current.value };
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
    if (radioButtonValue === "patient") {
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
      if (radioButtonValue === "doctor") {
        for(let i =0;i<patientSystemKey.length;i++){
          if (patientSystemKey[i].patientId === diagnosticResults.patientId) {
            decryptedPatientSystemKey = aesDecrypt(
              password,
              blowfishDecrypt(password, patientSystemKey[i].encryptedPatientSystemKey)
            );
            break;
          }
        }
      }
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
        "\n"
      );
    }
  }

  return (
    <div className="displayText">
      <input
        type="text"
        id="docpatId"
        name="docpatId"
        ref={docpatIdRef}
      ></input>
      <br />
      <input
        type="radio"
        id="doctor"
        name="user"
        value="doctor"
        onChange={handleRadioChange}
      />
      <label for="doctor">Doctor</label>
      <input
        type="radio"
        id="patient"
        name="user"
        value="patient"
        onChange={handleRadioChange}
      />
      <label for="patient">Patient</label>
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
    </div>
  );
}

export default DisplayPatientDetails;
