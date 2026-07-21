import { Link } from "react-router-dom";
import "../ANavbar/ANavbar.css";

export default function Navbar() {
    return (
        <nav id="nav-bar">
            <h1>Mando's Sports Book</h1>
            
            <div>
                <p>Balance: $100.00</p>
            </div>

            <div id="btns-container">
                <Link to="/login">
                    <button id="login-btn" className="btn">
                        Sign Out
                    </button>
                </Link>
                <Link to="/profile">
                    <button id="profile-btn" className="btn">Profile</button>
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