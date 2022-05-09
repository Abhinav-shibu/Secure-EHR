import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect } from 'react';

function DoctorHomePage(){


    const navigate = useNavigate();
    function handleDPD(){
        navigate("/displayPatientDetails")         
    }
    function handleAPD() {
        navigate("/addPatientDiagnoses")
    }
    function handleAP() {
        navigate("/doctorPatientLink")
    }

    useEffect(() => {
        fetch("/getUsername", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then(res=> res.json()).then(data => data.isLoggedIn ? navigate("/doctor/home"): navigate("/"))
    },[])

    return(<div>
        <Navbar />
        <div className="buttonContainer">
            <button className="butt" onClick={handleDPD}>
                Display Patient Details
            </button>
            <button className="butt" onClick={handleAPD}>
                Add Patient Diagnosis
            </button>
            <button className='butt' onClick={handleAP}>
                Add Patient
            </button>
        </div>
    </div>);
}

export default DoctorHomePage;