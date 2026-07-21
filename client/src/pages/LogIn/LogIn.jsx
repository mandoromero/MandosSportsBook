import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalReducer, ACTIONS } from "../../hooks/useGlobalReducer";

import "../LogIn/LogIn.css";

export default function Login() {
  const { dispatch } = useGlobalReducer();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
   e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    alert("Login successful!");

    // update Context (THIS fixes Navbar)
    dispatch({
      type: ACTIONS.SET_USER,
      payload: {
        user: res.data.user,
        token: res.data.token,
      },
    });

    // backup persistence
    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    // FIXED ROUTE
    navigate(`/profile/${res.data.user.id}`);

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Login failed"
    );
  }
};

  return (
    <div id="login-container">
      <h2 className="login-title">Login</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-email-password-container">

          <div className="login-email-container">
            <label htmlFor="login-email">Email</label>

            <input
              type="email"
              id="login-email"   // ✅ what you asked for
              value={email}
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-password-container">
            <label htmlFor="password">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              className="login-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i 
              className={`fa-solid ${
                showPassword
                  ? "fa-eye-slash"
                  : "fa-eye"
                } login-toggle-icon`}
               onClick={()=> 
                setShowPassword(!showPassword)
              }
            ></i>
          </div>

        </div>

        <p className="forgot-password">
          <Link to="/forgotpassword">Forgot Password?</Link>
        </p>

        <div id="login-buttons-container">
          <button className="login-button" type="submit">
            Enter
          </button>

          <Link to="/">
            <button className="login-button" type="button">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}