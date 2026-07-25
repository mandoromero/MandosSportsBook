import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../SignUp/SignUp.css";

export default function SignUp() {
  const [emailExists, setEmailExists] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    gender: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    verifyPassword: "",
  });

  const passwordsMatch = formData.verifyPasswords;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const checkEmail = async (email) => {
    if (!email) return;

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/check-email",
        {email}
      );

      setEmailExists(res.data.exists);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("SUBMIT CLICKED");
    console.log(formData);

    console.log("password:", formData.password);
    console.log("verify:", formData.verifyPassword);

    if (formData.password !== formData.verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    if (emailExists) {
      setError("Please login instead");
      return;
    }

    try {
      console.log("SENDING TO BACKEND...", formData);

      const { verifyPassword, ...userData } = formData;

      const res = await axios.post(
        "http://localhost:5001/api/auth/signup",
        userData
      );

      console.log("SUCCESS:", res.data);

      navigate("/login");

    } catch (err) {
      console.log("❌ AXIOS ERROR:");
      console.log(err);
      console.log(err.response?.data);

      setError(
        err.response?.data?.message ||
        "Signup failed"
      );
    }
  };

  return (
    <div id="sign-up-container">
      <h2 id="sign-up-title">Sign Up</h2>

      <form id="sign-up" onSubmit={handleSubmit}>
      {error && <p id="signup-error">{error}</p>}
        {/* NAME SECTION */}
        <div id="gender-identity-container">
          <div className="gender-identity">
            <p id="gender-identity">Gender Indentity: </p>
          </div>
          <div className="radio-buttons">
            <label className="male">
              <input
                type="radio" 
                name="gender"
                value="Male"
              />
              Male
            </label>
            <label className="female">
              <input 
                type="radio"
                name="gender"
                value="Female"
              />
              Female
            </label>
          </div>
        </div>
        <div id="id-container">
          <div id="signup-first-name-container">
            <label htmlFor="first-name">First Name</label>
            <input
              id="first-name"
              name="firstName"
              className="signup-input"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div id="signup-middle-initial-container">
            <label htmlFor="middle-initial">M.I</label>
            <input
              id="middle-initial"
              name="middleInitial"
              className="signup-input"
              type="text"
              value={formData.middleInitial}
              onChange={handleChange}
            />
          </div>
          <div id="signup-last-name-container">
            <label htmlFor="last-name">Last Name</label>
            <input
              id="last-name"
              name="lastName"
              className="signup-input"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div id="username-email">
          <div id="signup-username-container">
            <label htmlFor="username">User Name</label>
            <input 
              id="username"
              name="username"
              className="signup-input"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />  
          </div>
          <div id="signup-email-container">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="signup-input"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => checkEmail(formData.email)}
              required
            />
            {emailExists && (
              <p className="email-exists">
                Email already registered.{" "}
                <Link to="/login">
                  Login here
                </Link>
              </p>
              )}
          </div>
        </div>
        {/* CONTACT */}
        <div id="signup-contact-container">    
          <div id="signup-phone-container">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              className="signup-input"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* DOB (NOW SINGLE FIELD) */}
          <div id="signup-dob-container">
            <label htmlFor="dob">DOB</label>
            <input
              id="dob"
              name="dob"
              className="signup-input"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>  
        </div>
        <div id="signup-password-verify-container">
          <div id="signup-password-container">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="signup-input"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}                required
            />

            <i 
              className={`fa-solid ${
                showPassword
                  ? "fa-eye-slash"
                  : "fa-eye"
                } password-toggle-icon`}
               onClick={()=> 
                setShowPassword(!showPassword)
              }
            ></i>

        
          </div>
          <div id="signup-verify-container">       
            <label htmlFor="verify-password">Verify Password</label>  
              <input
                id="verify-password"
                className="signup-input"
                name="verifyPassword"
                type={
                  showVerifyPassword
                    ? "text"
                    : "password"
                }
                value={formData.verifyPassword}                onChange={handleChange}
               required
              />
              <i
                className={`fa-solid ${
                  showVerifyPassword
                    ? "fa-eye-slash"
                    : "fa-eye"  
                  } verify-toggle-icon`}
                onClick={()=>
                  setShowVerifyPassword(
                    !showVerifyPassword
                  )
                }
              ></i>
          </div> 
        </div>
        <div id="submit-button-container">
          <button
            id="submit-btn"
            className="signup-btn" 
            type="signup-submit"
          >
            Submit
          </button>

          <Link to="/">
            <button 
              id="signup-cancel-btn"
              type="button"
              className="signup-btn"
            >
              Cancel
            </button>
          </Link>
        </div>   
      </form>
        
    </div>
  );
}