import { useEffect, useState } from "react";

function MessageBoard() {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Fetch current message on mount
  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error fetching message:", err));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ prevent page refresh

    fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // ✅ correct property name
      body: JSON.stringify({ message: newMessage }),   // ✅ correct spelling
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message); // update displayed message
        setNewMessage("");        // clear input
      })
      .catch((err) => console.error("Error updating message:", err));
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h2>📨 Message Board</h2>
      <p>
        <strong>Current Message:</strong> {message || "(none)"}
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter new message..."
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Update Message
        </button>
      </form>
    </div>
  );
}

export default MessageBoard;
