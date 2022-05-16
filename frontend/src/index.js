import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes,  Route,} from "react-router-dom";


import './index.css';
import App from './App';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import SignUp from './components/SignUp';
import AdminSignUp from './components/AdminSignUp';
import PatientDetails from './components/PatientDetails';
import DoctorDetails from './components/DoctorDetails';
import DoctorPatientLinkAdmin from './components/DoctorPatientLinkAdmin';
import DoctorPatientLink from './components/DoctorPatientLink';
import PatientDiagnoses from './components/PatientDiagnoses';
import DisplayPatientDetails from './components/DisplayPatientDetails';
import DoctorHomePage from './components/DoctorHomePage';
import PatientHomePage from './components/PatientHomePage';
import AdminHomePage from './components/AdminHomePage';



ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/app" element={<App />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/addPatientDetails" element={<PatientDetails />} />
      <Route path="/addDoctorDetails" element={<DoctorDetails />} />
      <Route path="/doctorPatientLink" element={<DoctorPatientLinkAdmin />} />
      <Route path="/doctor/doctorPatientLink" element={<DoctorPatientLink />} />
      <Route path="/addPatientDiagnoses" element={<PatientDiagnoses />} />
      <Route path="/displayPatientDetails" element={<DisplayPatientDetails />} />
      <Route path="/doctor/home" element={<DoctorHomePage />} />
      <Route path="/patient/home" element={<PatientHomePage />} />
      <Route path="/admin/home" element={<AdminHomePage />} />
      <Route path="/adminSignUp" element={<AdminSignUp />} />

    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);


