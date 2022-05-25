import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';

function DoctorHomePage(){

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();
    function handleDPD(){
        navigate("/displayPatientDetails")         
    }
    function handleAPD() {
        navigate("/addPatientDiagnoses")
    }
    function handleAP() {
        navigate("/doctor/doctorPatientLink")
    }

    useEffect(() => {
        let temp = "";
        async function firstFunc(){
            await fetch("/getUsername", {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then(res=> res.json()).then(data => data.isLoggedIn ?  (setUsername(data.username), temp = data.username, secondFunc(temp)) : navigate("/"))
        }      
        firstFunc();
    },[])
    async function secondFunc(temp){
        await fetch("/getNameFromId", { 
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                doctorId: temp
              }),
        }).then(res=> res.json()).then(data => setName(data))
    }

    return(<div>
        <Navbar />
        <p className='welcome'> WELCOME Dr. {name}! </p> 
        <div className="buttonContainer ">

            <div className='box_1_div'>
            <button className="butt btn btn-info btn-circle btn-xl box-1 "  onClick={handleDPD}>
                Display Patient Details
            </button>
            </div>


            <div className='box_2_div' >
            <button className="butt btn btn-info btn-circle btn-xl  box-2" onClick={handleAPD}>
                Add Patient Diagnosis
            </button>
            </div>

            <div className='box_3_div' >
            <button className='butt btn btn-info  btn-circle btn-xl  box-3 ' onClick={handleAP}>
                Add Patient
            </button>
            </div>


        </div>
    </div>);
}

export default DoctorHomePage;