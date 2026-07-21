import { Link, useNavigate } from "react-router-dom";
import { useGlobalReducer, ACTIONS } from "../../hooks/useGlobalReducer";
import "../Navbar/Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();

    const { store, dispatch } = useGlobalReducer();

    console.log("Navbar user:", store.user);

    const user = store.user;

    const handleLogout = () => {
        const confirmLogout = window.confirm(
            "Are you sure you want to log out?"
        );

        if (!confirmLogout) {
            return;
        }

        dispatch ({
            type: ACTIONS.LOGOUT,
        });

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <nav id="nav-bar">
            <h1>Mando's Sports Book</h1>

            {user && (
                <div className="balance-container">
                    <p className="balance">Balance:</p>
                    <p className="amount">
                        ${user.balance ?? 0}
                    </p>
                </div>
            )}

            <div id="btns-container">
                {user ? (
                    <>
                        <Link to={`/profile/${user.id}`}>
                            <button
                                id="profile-btn"
                                className="btn"
                            >
                                Profile
                            </button>
                        </Link>

                        <button
                            id="logout-btn"
                            className="btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button
                                id="login-btn"
                                className="btn"
                            >
                                Login
                            </button>
                        </Link>

                        <Link to="/signup">
                            <button
                                id="sign-up-btn"
                                className="btn"
                            >
                                Sign Up
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}