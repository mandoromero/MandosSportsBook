import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.port("http//localhost:5000/api/auth/login", { email, password });
      alert("Login successfull!");
      navigate("/profile");
    } catch (err) {
      console.error (err);
      alert(err.response?.data?.message) || "Login failed);
    }
  }

  return (
    <div id="login-container">
      <h2 className="login-title">Login</h2>

      <div className="login">
        <label htmlFor="email-login">Email</label>
        <input id="email-login" type="email" />
      </div>

      <div className="login">
        <label htmlFor="password-login">Password</label>
        <input id="password-login" type="password" />
      </div>

      <p className="forgot-password">
        <Link to="/reset-password">Forgot Password?</Link>
      </p>
      <div id="login-buttons-container">
        <button id="login-submit" className="button">Enter</button>
        <Link to="/">
          <button id="login-cancel" className="button">Cancel</button>
        </Link>
      </div>
    </div>
  );
}
