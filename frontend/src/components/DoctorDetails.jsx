import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import doctor from "../assets/doctor.jpg"

function DoctorDetails(){
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }
    const passwordRef = useRef();
    const nameInputRef = useRef();
    const ageInputRef = useRef();
    const sexInputRef = useRef();
    const addressInputRef = useRef();
    const phoneNumberInputRef = useRef();
    const departmentInputRef = useRef();
    const specializationInputRef = useRef();
    const navigate = useNavigate();

    // loader js

    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.querySelector('.button'),
            loader = document.querySelector('.loader'),
            check = document.querySelector('.check');
        
        btn.addEventListener('click', function () {
          loader.classList.add('active');    
        });
       
        loader.addEventListener('animationend', function() {
          check.classList.add('active'); 
        });
      });
    //   .......

    async function handleSubmit(){
        const name =  nameInputRef.current.value;
        const age =  ageInputRef.current.value;
        const sex =  sexInputRef.current.value;
        const address =  addressInputRef.current.value;
        const phoneNumber =  phoneNumberInputRef.current.value;
        const department =  departmentInputRef.current.value;
        const specialization = specializationInputRef.current.value;

        const newDoctorId = await fetch("/addDoctor", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                age: age,
                sex: sex,
                address: address,
                phoneNumber: phoneNumber,
                department,
                specialization
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
              user: "doctor",
              username: newDoctorId,
              password: passwordRef.current.value
            }),
          });
          sleep(4000).then(() => {
            navigate("/admin/home");
          })

    }

    return(
        <div>
            <Navbar />
            <p className="doc-detail">Add Doctor details </p>
             <div >
            <img class="doctor-img "  src={doctor}  />
            </div> 
            <form class="doc-form"> 
            
            <div className="doc-div">
                
                <label  className=" doc-details-text" for="name">Doctor name:</label><br />
                <input type="text" id="name" name="name" ref={nameInputRef}/><br />
                <label  className=" doc-details-text" for="age">Age</label><br />
                <input type="number" id="age" name="age" ref={ageInputRef}/><br />
                <label className=" doc-details-text"  for="sex">Sex</label><br />
                <input type="text" id="sex" name="sex"  ref={sexInputRef}/><br />
                <label className=" doc-details-text" for="address">Address</label><br />
                <input type="text" id="address" name="address" ref={addressInputRef}/><br />
                <label  className=" doc-details-text" for="phno">Phone Number</label><br />
                <input type="number" id="phno" name="phoneNumber" ref={phoneNumberInputRef}/><br />
                <label  className=" doc-details-text" for="dept">Department</label><br />
                <input type="text" id="dept" name="department" ref={departmentInputRef}/><br />
                <label className=" doc-details-text" for="spcl">Specialization</label><br />
                <input type="text" id="spcl" name="specialization" ref={specializationInputRef}/><br />
                <label className=" doc-details-text" for="password">Password</label><br/>
                <input type="password" name="password" id="password" ref={passwordRef}/><br/>
                <br/>
                <button class="button" type="submit" onClick={e => {
                    e.preventDefault()
                    handleSubmit()
                }}>Submit</button>
                
                <div class="loader">
                <div class="check">
                <span class="check-one"></span>
                <span class="check-two"></span>
                </div>
                </div>
  

             </div>
            
            </form>
        
        </div>
    );
}
export default DoctorDetails;