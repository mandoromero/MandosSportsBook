import React from "react";
import MessageBoard from "../components/MessageBoard.jsx";

export default function Home() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Welcome to the Home Page</h1>
      <MessageBoard />
    </div>
  );
}
