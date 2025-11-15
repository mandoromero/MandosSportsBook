import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import ResetPassword from "./components/ResetPassword/ResetPassword";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />      </Routes>
    </Router>
  );
}