// Importing React core libraries
import React from "react";
import ReactDOM from "react-dom/client";

// Import Redux Provider — gives all components access to the Redux store
import { Provider } from "react-redux";
import { store } from "./store/store.js";

// Import global styles and main App component
import "./index.css";
import App from "./App.jsx";

// Create the root element for the app (React 18+ syntax)
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app wrapped in StrictMode and Redux Provider
root.render(
  <React.StrictMode>
    {/* Provider connects the Redux store to the entire app */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

/*
🧠 Quick summary:
- ReactDOM.createRoot() mounts your React app to the <div id="root"> in index.html.
- <React.StrictMode> is a development tool that helps catch potential issues early.
- <Provider store={store}> makes the Redux store accessible throughout the app.
- <App /> is your root component, containing your routes (Home, About, etc.).

✅ When you run `npm run dev`:
  - Vite starts the development server.
  - This file boots up React, connects Redux, and renders <App />.
*/
