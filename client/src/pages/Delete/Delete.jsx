import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Delete/Delete.css";

export default function Delete() {
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        "http://localhost:5001/api/auth/delete-account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            password,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert(
        "Your account has been deleted."
      );

      navigate("/login");

    } catch (err) {
      console.error(
        "Delete account error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Failed to delete account"
      );
    }
  };

  return (
    <div id="delete-container">

      <h2 id="delete-title">
        Delete Account
      </h2>

      <form
        id="delete-form"
        onSubmit={handleDelete}
      >

        <div id="delete-password-container">

          <label htmlFor="delete-password">
            Confirm Password
          </label>

          <div className="delete-password-wrapper">

            <input
              id="delete-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
            />

            <i
              className={`fa-solid ${
                showPassword
                  ? "fa-eye-slash"
                  : "fa-eye"
              } delete-toggle-icon`}
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            ></i>

          </div>

        </div>
        <div id="delete-btn-container">
            <div id="delete-buttons">

            <button
                type="submit"
                id="delete-button"
                className="delete-button"
            >
                Delete
            </button>

            <button
                type="button"
                id="cancel-button"
                className="delete-button"
                onClick={() =>
                navigate("/login")
                }
            >
                Cancel
            </button>

            </div>
        </div>

      </form>

    </div>
  );
}