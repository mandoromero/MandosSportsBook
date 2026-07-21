import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../ForgotPassword/ForgotPassword.css";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="forgot-password-container">

      <h2 className="forgot-password-title">
        Forgot Password
      </h2>

      {/* SUCCESS MESSAGE */}
      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <form
        className="forgot-password-form"
        onSubmit={handleSubmit}
      >

        <div className="forgot-label-input">

          <label htmlFor="forgot-password-email">
            Email
          </label>

          <input
            id="forgot-password-email"
            className="forgot-password-input"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

        </div>

        <div className="forgot-password-btn-container">

          <button
            id="forgot-password-submit"
            type="submit"
            className="forgot-password-button"
          >
            Submit
          </button>

          <button
            id="forgot-password-cancel"
            type="button"
            className="forgot-password-button"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}