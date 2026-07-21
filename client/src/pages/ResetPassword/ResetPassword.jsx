import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../ResetPassword/ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Reset failed"
      );
    }
  };

  return (
    <div className="reset-password-container">

      <h2 className="reset-title">New Password</h2>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <form
        className="reset-form"
        onSubmit={handleSubmit}
    >
        <div className="input-container">
            <label htmlFor="reset-password">New Password</label>
            <input
                id="reset-password"
                type="password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
                required
            />
        </div>
        <div className="input-container">
            <label htmlFor="reset-confirm">Confirm Password</label>
            <input
                id="reset-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                    setConfirmPassword(e.target.value)
                }
                required
            />
        </div>
        <div className="reset-btn-container">
            <button
                className="reset-button" 
                type="submit"
            >
            Update Password
            </button>
        </div>

      </form>
    </div>
  );
}