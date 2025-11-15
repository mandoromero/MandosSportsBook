import "../SignUp/SignUp.css";

export default function SignUp() {
    return (
        <div id="sign-up-container">
            <h2 id="sign-up-title">Sign Up</h2>

            <div id="form sign-up">

              
                <div id="name-container">
                    <div className="signup-container first">
                        <label htmlFor="first-name">First Name</label>
                        <input id="first-name" type="text" />
                    </div>

                    <div className="signup-container middle">
                        <label htmlFor="middle-initial">Middle Initial</label>
                        <input id="middle-initial" type="text" />
                    </div>

                    <div className="signup-container last">
                        <label htmlFor="last-name">Last Name</label>
                        <input id="last-name" type="text" />
                    </div>
                </div>

                {/* CONTACT SECTION */}
                <div id="contact-info-container">
                    <div className="signup-container email-contact contact">
                        <label htmlFor="contact-email">Email</label>
                        <input id="contact-email" type="email" />
                    </div>
                    <div className="signup-container phone-contact contact">
                        <label htmlFor="phone-number">Phone Number</label>
                        <input id="phone-number" type="tel" />
                    </div>
                </div>

                {/* DOB SECTION */}
                <div id="date-of-birth-container">
                    <div className="dob dob-month">
                        <label htmlFor="month">Month</label>
                        <select id="month">
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>

                    <div className="dob dob-day">
                        <label htmlFor="day">Day</label>
                        <select id="day">
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dob dob-year">
                        <label htmlFor="year">Year</label>
                        <select id="year">
                            {Array.from({ length: 2004 - 1945 + 1 }, (_, i) => 2004 - i).map(
                                (year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                {/* PASSWORD SECTION */}
                <div id="password-container">
                    <div className="password">
                        <label htmlFor="enter-password">Choose a Password</label>
                        <input id="enter-password" type="password" />
                    </div>

                    <div className="password">
                        <label htmlFor="verify-password">Verify Password</label>
                        <input id="verify-password" type="password" />
                    </div>
                </div>
            </div>
            <button id="signup-submit" type="submit">Submit</button>
        </div>
    );
}
