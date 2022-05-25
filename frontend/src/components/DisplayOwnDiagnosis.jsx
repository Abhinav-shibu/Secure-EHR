import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { aesDecrypt } from "../encryption/Aes";
import { blowfishDecrypt } from "../encryption/Blowfish";
import Navbar from "./Navbar";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBCardText } from "mdbreact";

function DisplayOwnDiagnosis() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const patientIdInputRef = useRef();
  const [firstRender, setFirstRender] = useState(false);
  const [resultObject, setResultObject] = useState([]);

  useEffect(() => {
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) =>
        data.isLoggedIn
          ? (setUsername(data.username), handleSubmit(), setFirstRender(true))
          : navigate("/")
      );
  }, [firstRender]);

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
          blockchainId: diagnosticResults.blockchainId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        });

      const doctorName = await fetch("/getNameFromId", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: diagnosticResults.doctorId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          return data;
        });

      if (result === "Success") {
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

        setResultObject((oldArray) => [
          ...oldArray,
          {
            patientId: diagnosticResults.patientId,
            date: decryptedConsultationDate,
            symptoms: decryptedSymptoms,
            diagnosis: decryptedDiagnosis,
            result: result,
            doctorName: doctorName,
          },
        ]);
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
      } else if (result === "Failure") {
        console.log("Data Altered for " + diagnosticResults.patientId);
        setResultObject((oldArray) => [
          ...oldArray,
          {
            patientId: diagnosticResults.patientId,
            date: "Failure",
            symptoms: "Failure",
            diagnosis: "Failure",
            result: result,
            doctorName: doctorName,
          },
        ]);
      }
    }
  }

  return (
    <div className="displayText ">
      <Navbar />
      {resultObject.map((value, index) => {
        return (
          <div key={index} className="row justify-content-center mt-5 display">
            <div key={index} className="col-3">
              <MDBCard className="mdb">
                <MDBCardHeader className="mdb-body">
                  <MDBCardText className="mdb-text">{value.date}</MDBCardText>
                  <MDBCardText className="mdb-text">
                    Referred Doctor: Dr. {value.doctorName}
                  </MDBCardText>
                </MDBCardHeader>
                <MDBCardBody>
                  {value.result === "Success" ? (
                    <>
                      <div className="float-start">
                        Symptoms: {value.symptoms}
                      </div>
                      <div className="float-start">
                        Diagnosis: {value.diagnosis}
                      </div>
                    </>
                  ) : (
                    <div className="float-start">
                      Data Altered for this record
                    </div>
                  )}
                </MDBCardBody>
              </MDBCard>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DisplayOwnDiagnosis;
