import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../SignUp/SignUp.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    phone: "",
    month: "01",
    day: "01",
    year: "2004",
    password: "",
    verifyPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.verifyPassword) {
      alert("Passwords do not match");
      return;
    }

    // Convert DOB fields into a proper ISO date
    const dob = `${formData.year}-${formData.month}-${formData.day}`;

    try {
      const { verifyPassword, month, day, year, ...userData } = formData;
      await axios.post("http://localhost:5000/api/auth/signup", { ...userData, dob });
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div id="sign-up-container" onSubmit={handleSubmit}>
      <h2 id="sign-up-title">Sign Up</h2>
      <form id="sign-up">
        {/* NAME SECTION */}
        <div id="name-container">
          <div className="signup-container first">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-container middle">
            <label htmlFor="middleInitial">Middle Initial</label>
            <input
              id="middleInitial"
              type="text"
              value={formData.middleInitial}
              onChange={handleChange}
            />
          </div>

          <div className="signup-container last">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div id="contact-info-container">
          <div className="signup-container email-contact contact">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="signup-container phone-contact contact">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DOB SECTION */}
        <div id="date-of-birth-container">
          <div className="dob dob-month">
            <label htmlFor="month">Month</label>
            <select id="month" value={formData.month} onChange={handleChange}>
              {Array.from({ length: 12 }, (_, i) => {
                const val = String(i + 1).padStart(2, "0");
                return (
                  <option key={i + 1} value={val}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="dob dob-day">
            <label htmlFor="day">Day</label>
            <select id="day" value={formData.day} onChange={handleChange}>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="dob dob-year">
            <label htmlFor="year">Year</label>
            <select id="year" value={formData.year} onChange={handleChange}>
              {Array.from({ length: 2004 - 1945 + 1 }, (_, i) => 2004 - i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ) 
              )}
            </select>
          </div>
        </div>

            {/* PASSWORD SECTION */}
        <div id="password-container">
          <div className="password">
            <label htmlFor="password">Choose a Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="password">
            <label htmlFor="verifyPassword">Verify Password</label>
            <input
              id="verifyPassword"
              type="password"
              value={formData.verifyPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div id="signup-buttons">
          <button id="signup-submit" className="signup-button" type="submit">
            Submit
          </button>
          <Link to="/">
            <button id="signup-cancel" className="signup-button" type="button">
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>

  );
}
