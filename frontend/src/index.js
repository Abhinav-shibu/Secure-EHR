import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes,  Route,} from "react-router-dom";


import './index.css';
import App from './App';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PatientDetails from './components/PatientDetails';
import DoctorPatientLink from './components/DoctorPatientLink';
import PatientDiagnoses from './components/PatientDiagnoses';
import DisplayPatientDetails from './components/DisplayPatientDetails';
import DoctorHomePage from './components/DoctorHomePage';
import PatientHomePage from './components/PatientHomePage';



ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<App />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/addPatientDetails" element={<PatientDetails />} />
      <Route path="/doctorPatientLink" element={<DoctorPatientLink />} />
      <Route path="/addPatientDiagnoses" element={<PatientDiagnoses />} />
      <Route path="/displayPatientDetails" element={<DisplayPatientDetails />} />
      <Route path="/doctor/home" element={<DoctorHomePage />} />
      <Route path="/patient/home" element={<PatientHomePage />} />

    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);


