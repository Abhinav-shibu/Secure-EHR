import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";

function AdminHomePage() {
  const navigate = useNavigate();
  // function handleRPD() {
  //   navigate("/patient/signUp");
  // }
  function handleAPD() {
    navigate("/addPatientDetails");
  }
  function handleLPD() {
    navigate("/doctorPatientLink");
  }
  function handleADD() {
    navigate("/addDoctorDetails");
  }
  // function handleRDD() {
  //   navigate("/doctor/signUp");
  // }

  useEffect(() => {
    fetch("/getUsername", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) =>
        data.isLoggedIn ? navigate("/admin/home") : navigate("/adminLogin")
      );
  }, []);

  return (
  
    <div className="ad-home">
      <Navbar />
      <div className="buttonContainer  ">
        <div >
          <h2 className="admin-home" >Welcome Admin!</h2>
        </div>
        {/* <button className="butt" onClick={handleRPD}>
          Register Patient
        </button> */}

        <div className="butt1-div">
        <button className="butt1" onClick={handleAPD}>Add patient &nbsp; &nbsp;
         <span>  Details </span> 
        </button>
        </div>


        {/* <button className="butt" onClick={handleRDD}>
          Register Doctor
        </button> */}
        <div className="butt2-div" >
        <button className="butt2" onClick={handleADD}>New Doctor &nbsp; &nbsp;  
         <span> Details </span> 
        </button>
        </div>

        <div className="butt3-div">
        <button className="butt3" onClick={handleLPD}>Assign a doctor &nbsp; &nbsp;
         <span>  to Patient </span>
        </button>
        </div>

      </div>
    </div>

    
  );
}

export default AdminHomePage;
