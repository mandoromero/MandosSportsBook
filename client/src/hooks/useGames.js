import { useReducer, useEffect } from "react";
import axios from "axios";

const initialState = {
  games: [],
  loading: true,
  error: null
};

function gamesReducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, games: action.payload, loading: false };

    case "FETCH_ERROR":
      return { ...state, games: [], loading: false, error: action.payload };

    default:
      return state;
  }
}

export default function useGames(token) {
  const [state, dispatch] = useReducer(gamesReducer, initialState);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/sports/odds/americanfootball_nfl",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Handle expired token
        if (res.data?.message === "jwt expired") {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        dispatch({ type: "FETCH_SUCCESS", payload: res.data });

      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });

        // If axios throws 401
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    fetchGames();
  }, [token]);

  return state; // { games, loading, error }
}
