import { useRef } from "react";
import {aesEncrypt} from "../encryption/Aes";
import {blowfishEncrypt} from "../encryption/Blowfish";
const CryptoJS = require("crypto-js");


function PatientDetails(){

    const patientIdInputRef = useRef();
    const nameInputRef = useRef();
    const ageInputRef = useRef();
    const sexInputRef = useRef();
    const addressInputRef = useRef();
    const phoneNumberInputRef = useRef();

    async function handleSubmit(){
        const patientSystemKey = CryptoJS.lib.WordArray.random(64).toString();
        const username = prompt("Enter username");
        const password = prompt("Enter password");
        const result = await fetch("/check", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                user: "patient"
            })
        }).then((response)=>response.json()).then(data=>{return data})
        console.log(result);
        if (result === "False") {
            alert("Wrong Password");
        }
        else{
            console.time("timer1");
        const encryptedPatientSystemKey = blowfishEncrypt(password, aesEncrypt(password, patientSystemKey));
        const patientId =  patientIdInputRef.current.value;
        const name = aesEncrypt(patientSystemKey, nameInputRef.current.value);
        const age = aesEncrypt(patientSystemKey, ageInputRef.current.value);
        const sex = aesEncrypt(patientSystemKey, sexInputRef.current.value);
        const address = aesEncrypt(patientSystemKey, addressInputRef.current.value);
        const phoneNumber = aesEncrypt(patientSystemKey, phoneNumberInputRef.current.value);

        await fetch("/addPatient", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                systemKey: patientSystemKey,
                encryptedPatientSystemKey: encryptedPatientSystemKey,
                patientId: patientId,
                name: name,
                age: age,
                sex: sex,
                address: address,
                phoneNumber: phoneNumber
            })
        })
        console.timeEnd("timer1");
        }
    }

    return(
        <div>
            <form>
                <label for="pId">Patient ID:</label><br />
                <input type="text" id="pId" name="patientId" ref={patientIdInputRef} /><br />
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
                <button type="submit" onClick={e => {
                    e.preventDefault()
                    handleSubmit()
                }}>Submit</button>
            </form>
        </div>
    );
}
export default PatientDetails;