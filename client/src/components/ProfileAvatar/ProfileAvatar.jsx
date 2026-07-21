import defaultAvatar from "../../assets/default_avatar.svg"

export default function ProfileAvatar () {
    return (
        <div className="profile-avatar-container">
            <div id="profile-avatar">
                <div id="avatar-image-container">
                    <img
                        src={defaultAvatar}
                        alt="User avatar"
                        id="profile-avatar"
                    />
                    <div className="avatar-edit-containter">
                        <p id="edit-link">
                            Edit
                        </p>
                    </div>
                </div>
            </div>

            <div id="profile-name-container">
                <h2 id="profile-name">
                    {user.firstName}{" "}

                    {user.middleInitial
                        ? `${user.middleInitial} `
                        : ""}

                    {user.lastName}
                </h2>

                <h3 id="profile-id">
                    User ID: {user.id}
                </h3>
            </div>
        </div>
    );
}