import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { aesEncrypt } from "../encryption/Aes";
import { blowfishEncrypt } from "../encryption/Blowfish";
import Navbar from "./Navbar";

function DoctorPatientLink() {

  const [username, setUsername] = useState(null);
  const [pList, setPList] = useState([]);

  const navigate = useNavigate();

  async function handleSubmit() {
    const password = prompt("Enter password");
    for(let i=0;i<pList.length;i++){
    const patientId = pList[i];
    const patientSystemKey = await fetch("/getSystemKey", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId
      })
    }).then((response)=>response.json()).then(data=>{return data})
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
        if (result === "False") {
            alert("Wrong Password");
        }
        else{
    const encryptedPatientSystemKey = blowfishEncrypt(password, aesEncrypt(password, patientSystemKey));

        fetch(`/linkPatientSystemKey/${username}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                encryptedPatientSystemKey: encryptedPatientSystemKey,
                patientId: patientId,
            })
        })
      }
  }
  navigate("/doctor/home");
}
  async function getPatientList(){
    const resList = await fetch(`/getPendingPatientLinkList/${username}`, {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    }).then((response) => response.json())
    .then((data) => {
        return data;
    });
    setPList(resList);
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
    <div className="d-p-link">
    <div>
      <Navbar />
    </div>
    <div>
      <div className="doc-patient">
          <button  onClick={getPatientList}>GET</button>
      </div>
      <div>
      <ul>
      {pList.map((value, index) => {
        return <li key={index}>{value}</li>
      })}
    </ul>
      </div>
      <div onClick={handleSubmit}>
          <button>Generate System Keys</button>
      </div>
    </div>
  </div>
 
  );
}

export default DoctorPatientLink;
