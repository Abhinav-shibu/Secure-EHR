import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


function DoctorDetails(){

    const doctorIdInputRef = useRef();
    const nameInputRef = useRef();
    const ageInputRef = useRef();
    const sexInputRef = useRef();
    const addressInputRef = useRef();
    const phoneNumberInputRef = useRef();
    const departmentInputRef = useRef();
    const specializationInputRef = useRef();
    const navigate = useNavigate();

    async function handleSubmit(){
        const doctorId =  doctorIdInputRef.current.value;
        const name =  nameInputRef.current.value;
        const age =  ageInputRef.current.value;
        const sex =  sexInputRef.current.value;
        const address =  addressInputRef.current.value;
        const phoneNumber =  phoneNumberInputRef.current.value;
        const department =  departmentInputRef.current.value;
        const specialization = specializationInputRef.current.value;

        await fetch("/addDoctor", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                doctorId: doctorId,
                name: name,
                age: age,
                sex: sex,
                address: address,
                phoneNumber: phoneNumber,
                department,
                specialization
            })
        })

        navigate("/admin/home");

    }

    return(
        <div>
            <Navbar />
            <form>
                <label for="pId">Doctor ID:</label><br />
                <input type="text" id="pId" name="patientId" ref={doctorIdInputRef} /><br />
                <label for="name">Doctor name:</label><br />
                <input type="text" id="name" name="name" ref={nameInputRef}/><br />
                <label for="age">Age</label><br />
                <input type="number" id="age" name="age" ref={ageInputRef}/><br />
                <label for="sex">Sex</label><br />
                <input type="text" id="sex" name="sex"  ref={sexInputRef}/><br />
                <label for="address">Address</label><br />
                <input type="text" id="address" name="address" ref={addressInputRef}/><br />
                <label for="phno">Phone Number</label><br />
                <input type="number" id="phno" name="phoneNumber" ref={phoneNumberInputRef}/><br />
                <label for="dept">Department</label><br />
                <input type="text" id="dept" name="department" ref={departmentInputRef}/><br />
                <label for="spcl">Specialization</label><br />
                <input type="text" id="spcl" name="specialization" ref={specializationInputRef}/><br />
                <button type="submit" onClick={e => {
                    e.preventDefault()
                    handleSubmit()
                }}>Submit</button>
            </form>
        </div>
    );
}
export default DoctorDetails;