import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Login/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Save token (and maybe user info) in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setStatus("✅ Login successful!");
      // Go to profile page
      navigate("/Profile");
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div id="login-container">
      <h2 className="login-title">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="login">
          <label htmlFor="email-login">Email</label>
          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login">
          <label htmlFor="password-login">Password</label>
          <input
            id="password-login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p className="forgot-password">
          <Link to="/ResetPassword">Forgot Password?</Link>
        </p>

        <div id="login-buttons-container">
          <button id="login-submit" className="button" type="submit">
            Enter
          </button>
          <Link to="/">
            <button id="login-cancel" className="button" type="button">
              Cancel
            </button>
          </Link>
        </div>

        {status && (
          <p style={{ marginTop: "1rem", textAlign: "center" }}>{status}</p>
        )}
      </form>
    </div>
  );
}
