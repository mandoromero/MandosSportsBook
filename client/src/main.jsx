import ReactDOM from "react-dom/client";
import { StoreProvider } from "./hooks/useGlobalReducer.jsx";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);