import {useNavigate} from 'react-router-dom';
import Navbar from './Navbar';

function PatientHomePage(){

    const navigate = useNavigate();
    function handleDPD(){
        navigate("/displayOwnDiagnosis")         
    }
    
    return(<div>
        <Navbar />
        <div className="buttonContainer btn-center">
            <button className="butt btn btn-dark" onClick={handleDPD}>
            Display Patient Diagnosis
            </button>
        </div>
    </div>);
}

export default PatientHomePage;