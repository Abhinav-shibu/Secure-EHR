import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes,  Route,} from "react-router-dom";


import './index.css';
import App from './App';
import Login from './components/Login';
import SignUp from './components/SignUp';


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<App />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);


