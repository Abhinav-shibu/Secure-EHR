import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { aesDecrypt } from "../encryption/Aes";
import { blowfishDecrypt } from "../encryption/Blowfish";
import Navbar from "./Navbar";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBCardText } from "mdbreact";

function DisplayPatientDetails() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const patientIdInputRef = useRef();
  const [firstRender, setFirstRender] = useState(false);
  const [resultObject, setResultObject] = useState([]);
  const [pList, setPList] = useState([]);
  const [pageDataVariable, setPageDataVariable] = useState([]);

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
    getPatientList();
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
        for (let i = 0; i < patientSystemKey.length; i++) {
          if (patientSystemKey[i].patientId === diagnosticResults.patientId) {
            decryptedPatientSystemKey = aesDecrypt(
              password,
              blowfishDecrypt(
                password,
                patientSystemKey[i].encryptedPatientSystemKey
              )
            );
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
          blockchainId: diagnosticResults.blockchainId,
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
          },
        ]);
      }
    }
  }

  function pageData() {
    setPageDataVariable([]);
    resultObject.map((value, index) => {
      if (value.patientId === patientIdInputRef.current.value) {
        setPageDataVariable((oldArray) => [...oldArray, value]);
      }
    });
  }

  async function getPatientList() {
    await fetch("/getPatientList", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctorId: username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPList(data);
      });
  }

  return (
    <div className="displayText ">
      <Navbar />

      {/* {console.log("hello " + username)}  */}
      <div className=" select-patient">
        <select
          className="pId btn btn-dark get_patient "
          id="pId"
          ref={patientIdInputRef}
          onChange={pageData}
        >
          <option value="none" selected disabled hidden>
            Select a Patient
          </option>
          {pList.map((value, index) => {
            return (
              <option key={value.patientId} value={value.patientId}>
                {value.patientId}
              </option>
            );
          })}
        </select>
      </div>
      {pageDataVariable.map((value, index) => {
        return (
          <div key={index} className="row justify-content-center mt-5 display">
            <div key={index} className="col-3">
              <MDBCard className="mdb">
                <MDBCardHeader className="mdb-body">
                  <MDBCardText className="mdb-text">{value.date}</MDBCardText>
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

export default DisplayPatientDetails;
