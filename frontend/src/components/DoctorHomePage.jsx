import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';

function DoctorHomePage(){

    const [username, setUsername] = useState(null);

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
        fetch("/getUsername", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then(res=> res.json()).then(data => data.isLoggedIn ? (navigate("/doctor/home"), setUsername(data.username)): navigate("/"))
    },[])

    return(<div>
        <Navbar />
        <p className='welcome'> WELCOME {username}! </p> 
        <div className="buttonContainer ">

            <div >
            <button className="butt btn btn-info btn-circle btn-xl box-1 "  onClick={handleDPD}>
                Display Patient Details
            </button>
            </div>


            <div>
            <button className="butt btn btn-info btn-circle btn-xl  box-2" onClick={handleAPD}>
                Add Patient Diagnosis
            </button>
            </div>

            <div>
            <button className='butt btn btn-info  btn-circle btn-xl  box-3 ' onClick={handleAP}>
                Add Patient
            </button>
            </div>


        </div>
    </div>);
}

export default DoctorHomePage;