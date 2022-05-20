import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';

function PatientHomePage(){

    const navigate = useNavigate();
    function handleDPD(){
        navigate("/displayPatientDetails")         
    }
    return(<div>
        <Navbar />
        <div className="buttonContainer">
            <button className="butt" onClick={handleDPD}>
            Display Patient Diagnosis
            </button>
        </div>
    </div>);
}

export default PatientHomePage;