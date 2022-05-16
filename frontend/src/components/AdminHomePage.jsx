import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect } from 'react';

function DoctorHomePage(){


    const navigate = useNavigate();
    function handleDAP(){
        navigate("/displayPatientDetails")         
    }
    function handleAPD() {
        navigate("/addPatientDetails")
    }
    function handleLPD() {
        navigate("/doctorPatientLink")
    }

    useEffect(() => {
        fetch("/getUsername", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then(res=> res.json()).then(data => data.isLoggedIn ? navigate("/admin/home"): navigate("/adminLogin"))
    },[])

    return(<div>
        <Navbar />
        <div className="buttonContainer">
            <button className="butt" onClick={handleDAP}>
                Display all Patients
            </button>
            <button className="butt" onClick={handleAPD}>
                Add Patient Details
            </button>
            <button className='butt' onClick={handleLPD}>
                Link Patient Doctor
            </button>
        </div>
        <div>
            <h2>Welcome Admin!</h2>
        </div>
    </div>);
}

export default DoctorHomePage;