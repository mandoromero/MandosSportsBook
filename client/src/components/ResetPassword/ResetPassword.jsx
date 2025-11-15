import "./ResetPassword.css";

export default function ResetPassword() {
    return(
        <div id="reset-password-container">
            <h2 id="reset-password-title">Reset Password</h2>
            <div className="reset-password">
                <label for="enter-email">Enter Email</label>
                <input id="enter-email" type="email" />
            </div>    
            <button id="reset-password-btn" type="submit">Submit</button>
        </div>
    )
}