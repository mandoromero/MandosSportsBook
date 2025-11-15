import "../Login/Login.css";

export default function Login() {
    return(
        <div id="login-container">
            <h2 className="login-title">Login</h2>
            <div className="login">
                <label for="email-login">Email</label>
                <input id="email-login" type="email" />
            </div>
            <div className="login">
                <label for="password-login">Password</label>
                <input id="password-login" type="text" />
            </div>
            <p className="forgot-password">Forgot Password</p>
        </div>
    )
}