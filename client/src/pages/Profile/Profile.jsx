import { useEffect, useState } from "react";
import axios from "axios";
import "../Profile/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div id="profile">
      <h1>Profile</h1>

      <header id="profile-header">
        <div id="image-edit-container">
          <div id="image-container">
            {/* Placeholder image for now */}
            <img
              src="https://via.placeholder.com/120"
              alt="User avatar"
            />
          </div>
          <p id="edit-link">Edit</p>
        </div>

        <div id="profile-name-container">
          <h2 id="profile-name">
            {user.firstName}{" "}
            {user.middleInitial ? `${user.middleInitial} ` : ""}
            {user.lastName}
          </h2>
          <h3 id="profile-id">User ID: {user._id}</h3>
        </div>
      </header>

      <main id="profile-info">
        <div id="profile-email-container" className="user-info">
          <p id="email-label">Email</p>
          <p id="user-email">{user.email}</p>
        </div>

        <div id="profile-phone-container" className="user-info">
          <p id="phone-label">Phone Number</p>
          <p id="user-phone">{user.phone || "Not provided"}</p>
        </div>

        <div id="profile-dob-container" className="user-info">
          <p id="dob-label">Date of Birth</p>
          <p id="user-dob">
            {user.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
          </p>
        </div>

        <div id="profile-password-container" className="user-info">
          <p id="password-label">Password</p>
          <p id="user-password">********</p>
        </div>
      </main>
    </div>
  );
}
