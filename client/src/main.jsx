// Importing React core libraries
import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalProvider } from "./hooks/useGlobalReducer.jsx";
import "./index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);