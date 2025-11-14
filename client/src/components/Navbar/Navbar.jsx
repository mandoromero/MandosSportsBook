import "../Navbar/Navbar.css";

export default function Navbar() {
    return (
        <nav id="nav-bar">
            <h1>Mando's Sports Book</h1>
            <div id="btns-container">
                <button id="login-btn" className="btn">Login</button>
                <button id="sign-up-btn" className="btn">Sign Up</button>
            </div>
        </nav>
    )
}