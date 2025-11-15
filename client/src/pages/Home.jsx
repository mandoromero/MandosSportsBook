import React from "react";
import Navbar from "../components/Navbar/Navbar.jsx"
// import Login from "../components/Login/Login.jsx";
// import ResetPassword from "../components/ResetPassword/ResetPassword.jsx";
import SignUp from "../components/SignUp/SignUp.jsx";
export default function Home() {
  return (
    <div>
      <Navbar />
      {/* <ResetPassword /> */}
      {/* <Login /> */}
      <SignUp />
    </div>
  );
}
