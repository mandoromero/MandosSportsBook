import "../Profile/Profile.css";

export default function Profile() {
    return (
        <div id="profile">
            <h1>Profile</h1>
            <header id="profile-header">
                <div id="image-edit-container">
                    <div id="image-container">
                        <img />
                    </div>
                    <p id="edit-link">Edit</p>
                </div>
                <div id="profile-name-container">
                    <h2 id="profile-name">User Name</h2>
                    <h3 id="profile-id">User Id Number</h3>
                </div>
            </header>
            <main id="profile-info">
                <div id="profile-email-container" className="user-info">
                    <p id="email-label">Email</p>
                    <p id="user-emial">User Email</p>
                </div>
                <div id="profile-phone-container" className="user-info">
                    <p id="phone-label">Phone Number</p>
                    <p id="user-phone">(555)555-5555</p>
                </div>
                <div id="profile-dob-container" className="user-info">
                    <p id="dob-label">Date of Birth</p>
                    <p id="user-dob">Month/DD/YYYY</p>
                </div>
                <div id="profile-password-container" className="user-info">
                    <p id="password-label">Password</p>
                    <p id="user-password">********</p>
                </div>
            </main>

        </div>
    )
}