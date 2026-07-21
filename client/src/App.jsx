import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home/Home";
import LogIn from "./pages/LogIn/LogIn";
import SignUp from "./pages/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Delete from "./pages/Delete/Delete";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NFLGames from "./pages/NFLGames/NFLGames";
import NFLPoolResults from "./pages/NFLPoolResults/NFLPoolResults";

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/delete/:id"
          element={
            <ProtectedRoute>
              <Delete />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nfl-games"
          element={
            <ProtectedRoute>
              <NFLGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nfl-pool-results"
          element={
            <ProtectedRoute>
              <NFLPoolResults />
            </ProtectedRoute>
          }
      />
      </Routes>
    </Router>
  );
}