
import { useReducer, useEffect } from "react";
import axios from "axios";

const initialState = {
  games: [],
  loading: true,
  error: null,
};

function gamesReducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        games: action.payload,
        loading: false,
        error: null,
      };

    case "FETCH_ERROR":
      return {
        games: [],
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

export default function useGames(token) {
  const [state, dispatch] = useReducer(
    gamesReducer,
    initialState
  );

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/nfl/schedule/season/2026",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error("Unable to load NFL schedule.");
        }

        console.log(
          "🏈 NFL schedule loaded:",
          response.data.games.length
        );

        dispatch({
          type: "FETCH_SUCCESS",
          payload: response.data.games,
        });
      } catch (error) {
        console.error("NFL schedule error:", error);

        dispatch({
          type: "FETCH_ERROR",
          payload:
            error.response?.data?.message ||
            error.message ||
            "Unable to load NFL schedule.",
        });

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    if (token) {
      fetchGames();
    }
  }, [token]);

  return state;
}
