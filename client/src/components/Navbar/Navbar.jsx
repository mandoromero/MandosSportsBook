import { Link } from "react-router-dom";
import "../Navbar/Navbar.css";

export default function Navbar() {
  return (
    <nav id="nav-bar">
      <h1>Mando's Sports Book</h1>

      <div id="btns-container">
        <Link to="/login">
          <button id="login-btn" className="btn">
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button id="sign-up-btn" className="btn">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
