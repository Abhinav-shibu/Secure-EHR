import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";

function AdminHomePage() {
  const navigate = useNavigate();
  function handleRPD() {
    navigate("/signUp");
  }
  function handleAPD() {
    navigate("/addPatientDetails");
  }
  function handleLPD() {
    navigate("/doctorPatientLink");
  }
  function handleADD() {
    navigate("/addDoctorDetails");
  }

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
    <div>
      <Navbar />
      <div className="buttonContainer">
        <div>
          <h2>Welcome Admin!</h2>
        </div>
        <button className="butt" onClick={handleRPD}>
          Register Patient
        </button>
        <button className="butt" onClick={handleAPD}>
          Add Patient Details
        </button>
        <button className="butt" onClick={handleRPD}>
          Register Doctor
        </button>
        <button className="butt" onClick={handleADD}>
          Add Doctor Details
        </button>
        <button className="butt" onClick={handleLPD}>
          Link Patient Doctor
        </button>
      </div>
    </div>
  );
}

export default AdminHomePage;
