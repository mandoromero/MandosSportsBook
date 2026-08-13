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
          "http://localhost:5001/sports/odds/americanfootball_nfl",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sorted = [...res.data].sort(
          (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
        );

        dispatch({ type: "FETCH_SUCCESS", payload: sorted });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    fetchGames();
  }, [token]);

  return state;
}
