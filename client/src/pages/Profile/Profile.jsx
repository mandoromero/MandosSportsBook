import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../Profile/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");
  const [isEditing, setIsEditing] = useState(false);

  const token =
    localStorage.getItem("token");

  const { id } = useParams();

  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) {
            setError(
              "You must be logged in."
            );
            return;
          }

          console.log("Token:", token);

          const res = await axios.get(
            "http://localhost:5001/api/auth/profile",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          setUser(res.data.user);
        } catch (err) {
          console.error(
            "Error fetching profile:",
            err.response?.data || err
          );

          setError(
            err.response?.data
              ?.message ||
              "Failed to load profile."
          );
        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchProfile();
    } else {
      setError("Invalid profile ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <p>
        Loading profile...
      </p>
    );
  }

  if (error) {
    return (
      <p className="error-message">
        {error}
      </p>
    );
  }

  if (!user) {
    return (
      <p>
        User not found.
      </p>
    );
  }

  const handleSave = 
    async () => {
      try {
        const token = 
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `http://localhost:5001/api/auth/profile/${id}`,
          {
            firstName: user.firstName,
            middleInitial: user.middleInitial,
            lastName: user.lastName,
            gender: user.gender,
            email: user.email,
            phone: user.phone,
            dob: user.dob,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Profile updated!");
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        alert(err.response?.data ?.message || "Update failed");
      }
    }

  return (
    <div id="profile">
      {token && (
        <Link to="/nfl-games">
          NFL Games
        </Link>
)}
      <h2 className="profile-title">Profile</h2>
      <div className="money">
        <div id="balance-container" className="money-containere">
          <p>Balance</p>
          <p className="profile-input">$0</p>
        </div>
        <div id="bettimg-amount" className="money-container">
          <p>Betting Amount</p>
          <p className="profile-input">$0</p>
        </div>
      </div>
      <div>
        <p>User ID:</p>
        <p className="profile-input">{user.id}</p>
      </div>
      <div className="profile-header">
        <div id="profile-name-contianer">
          <p className="profile-full-name">Name:</p>
          <div id="profile-name">
            {isEditing ? (
              <input 
                className="profile-input profile-name"
                type="text"
                value={user.firstName || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    firstName:
                      e.target.value,  
                  })
                }  
              />
            ) : (
              <p className="profile-first profile-input">{user.firstName}</p> 
            )}

            {isEditing ? (
              <input 
                className="profile-input"
                type="text"
                value={user.middleInitial || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    niddleInitial:
                      e.target.value,  
                  })
                }  
              />
            ) : (
              <p className="profile-middle profile-input">{user.middleInitial}</p> 
            )}

            {isEditing ? (
              <input 
                className="profile-input profile-name"
                type="text"
                value={user.lastName || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    lastName:
                      e.target.value,  
                  })
                }  
              />
            ) : (
               <p className="profile-last profile-input">{user.lastName}</p>
            )}
          </div>
        </div>

        <div className="profile-username-container">
          <p id="profile-username">Username:</p>
          {isEditing ? (
              <input
                className="profile-input" 
                type="text"
                value={user.username || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    username:
                      e.target.value,  
                  })
                }  
              />
            ) : (
             <p className="profile-username profile-input">{user.username}</p>
            )}
          
        </div>
        <div className="profile-gender-container">
          <p className="gender">Gender</p>
          {isEditing ? (
              <input
                className="profile-input" 
                type="text"
                value={user.gender || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    gender:
                      e.target.value,  
                  })
                }  
              />
            ) : (
             <p className="profile-input">{user.gender}</p>
            )}
        </div>
        
      </div>
      <div className="profile-info">
        <div className="profile-email-container">
          <p id="profile-email">Email:</p>
          {isEditing ? (
            <input
              className="profile-input"
              type="email"
              value={user.email || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  email:
                    e.target.value,
                })
              }
            />
          ) : (
            <p className="profile-email profile-input">{user.email}</p>
          )}
          
        </div>
        <div className="profile-phone-container">
          <p id="profile-phone">Phone Number:</p>
          {isEditing ? (
            <input
              className="profile-input"
              type="tel"
              value={user.phone || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  phone:
                  e.target.value,
                })
              }
            />
          ) : (
          <p className="profile-phone profile-input">{user.phone}</p>
        )}
          
        </div>
        <div className="profile-dob-container">
          <p  id="profile-dob">DOB:</p>
          {isEditing ? (
            <input
              className="profile-input"
              type="date"
              value={
                user.dob
                ? user.dob.split("T")[0]
                : ""
              }
              onChange={(e) =>
                setUser({
                  ...user,
                  dob:
                  e.target.value,
                })
              }
            />
          ) : (
            <p className="profile-dob profile-input">{new Date(user.dob).toLocaleDateString("en-US")}</p>
          )}  
        </div>
      </div>
      <div>
          <p>Password:</p>
          <p className="profile-password-input profile-input">************</p>
        </div>
        <div className="profile-btns-container">
          <button className="profile-btn">Change Password</button>
          <button 
            className="profile-btn"
            id="edit-link"
            onClick={() =>
              setIsEditing(!isEditing)
            } 
          >
            {isEditing ? "Cancel"  : "Edit Profile"}
          </button>
          {
            isEditing && (
              <button
                className="profile-btn"
                onClick={handleSave}
              >
                Save Changes
              </button>
            )
          }
        </div>
    </div>
  );
}