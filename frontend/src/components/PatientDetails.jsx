import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {aesEncrypt} from "../encryption/Aes";
import {blowfishEncrypt} from "../encryption/Blowfish";
import Navbar from "./Navbar";
const CryptoJS = require("crypto-js");


function PatientDetails(){

    const passwordRef = useRef();
    const nameInputRef = useRef();
    const ageInputRef = useRef();
    const sexInputRef = useRef();
    const addressInputRef = useRef();
    const phoneNumberInputRef = useRef();
    const navigate = useNavigate();


    async function handleSubmit(){
        const patientSystemKey = CryptoJS.lib.WordArray.random(64).toString();
        // const result = await fetch("/check", {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         username: patientIdInputRef.current.value,
        //         password: passwordRef.current.value ,
        //         user: "patient"
        //     })
        // }).then((response)=>response.json()).then(data=>{return data})
        // console.log(result);
        // if (result === "False") {
        //     alert("Wrong Password");
        // }
        // else{
        const encryptedPatientSystemKey = blowfishEncrypt(passwordRef.current.value, aesEncrypt(passwordRef.current.value, patientSystemKey));
        const name = aesEncrypt(patientSystemKey, nameInputRef.current.value);
        const age = aesEncrypt(patientSystemKey, ageInputRef.current.value);
        const sex = aesEncrypt(patientSystemKey, sexInputRef.current.value);
        const address = aesEncrypt(patientSystemKey, addressInputRef.current.value);
        const phoneNumber = aesEncrypt(patientSystemKey, phoneNumberInputRef.current.value);

        const newPatientId = await fetch("/addPatient", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemKey: patientSystemKey,
                encryptedPatientSystemKey: encryptedPatientSystemKey,
                name: name,
                age: age,
                sex: sex,
                address: address,
                phoneNumber: phoneNumber
            })
        })
        .then((response)=>response.json()).then(data=>{
            alert("Your username is "+ data)
            return data;
          })
        
        await fetch("/signUp", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: "patient",
              username: newPatientId,
              password: passwordRef.current.value
            }),
          });
        navigate("/admin/home")
        // }
    }

    return(
        <div>
            <Navbar />
            <form>
                <label for="name">Patient name:</label><br />
                <input type="text" id="name" name="name" ref={nameInputRef}/><br />
                <label for="age">Age</label><br />
                <input type="number" id="age" name="age" ref={ageInputRef}/><br />
                <label for="sex">Sex</label><br />
                <input type="text" id="sex" name="sex"  ref={sexInputRef}/><br />
                <label for="address">Address</label><br />
                <input type="text" id="address" name="address" ref={addressInputRef}/><br />
                <label for="phno">Phone Number</label><br />
                <input type="number" id="phno" name="phoneNumber" ref={phoneNumberInputRef}/><br />
                <label for="patientPassword">Patient Password:</label><br />
                <input type="text" id="patientPassword" name="patientPassword" ref={passwordRef} /><br />
                <button type="submit" onClick={e => {
                    e.preventDefault()
                    handleSubmit()
                }}>Submit</button>
            </form>
        </div>
    );
}
export default PatientDetails;