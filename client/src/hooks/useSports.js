
import { useEffect, useReducer } from "react";
import axios from "axios";

/* =========================
   ACTION TYPES
========================= */
const SPORTS_ACTIONS = {
  SET_SPORTS: "SET_SPORTS",
  SET_ODDS: "SET_ODDS",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

/* =========================
   INITIAL STATE
========================= */
const initialSportsState = {
  sports: [],
  oddsBySport: {},
  loading: false,
  error: null,
};

/* =========================
   SPORTS REDUCER
========================= */
const sportsReducer = (state, action) => {
  switch (action.type) {
    case SPORTS_ACTIONS.SET_SPORTS:
      return {
        ...state,
        sports: action.payload,
      };

    case SPORTS_ACTIONS.SET_ODDS:
      return {
        ...state,
        oddsBySport: {
          ...state.oddsBySport,
          [action.payload.key]: action.payload.games,
        },
      };

    case SPORTS_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SPORTS_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

/* =========================
   CUSTOM HOOK
========================= */
export const useSports = () => {
  const [store, dispatch] = useReducer(
    sportsReducer,
    initialSportsState
  );

  useEffect(() => {
    const fetchSportsAndOdds = async () => {
      dispatch({
        type: SPORTS_ACTIONS.SET_LOADING,
        payload: true,
      });

      dispatch({
        type: SPORTS_ACTIONS.SET_ERROR,
        payload: null,
      });

      try {
        // 1. Fetch available sports from your backend
        const sportsRes = await axios.get(
          "http://localhost:5001/sports"
        );

        dispatch({
          type: SPORTS_ACTIONS.SET_SPORTS,
          payload: sportsRes.data,
        });

        // 2. Supported sports
        const supportedSports = [
          "americanfootball_nfl",
          "basketball_nba",
          "baseball_mlb",
          "icehockey_nhl",
        ];

        const playableSports = sportsRes.data.filter((sport) =>
          supportedSports.includes(sport.key)
        );

        // 3. Fetch odds for all supported sports concurrently
        const results = await Promise.allSettled(
          playableSports.map(async (sport) => {
            const oddsRes = await axios.get(
              `http://localhost:5001/sports/odds/${sport.key}`
            );

            dispatch({
              type: SPORTS_ACTIONS.SET_ODDS,
              payload: {
                key: sport.key,
                games: oddsRes.data,
              },
            });
          })
        );

        // Report individual odds request failures
        const failedRequests = results.filter(
          (result) => result.status === "rejected"
        );

        if (failedRequests.length > 0) {
          console.error(
            `${failedRequests.length} sport odds request(s) failed.`
          );
        }
      } catch (err) {
        console.error("Error fetching sports:", err.message);

        dispatch({
          type: SPORTS_ACTIONS.SET_ERROR,
          payload:
            err.response?.data?.message ||
            "Failed to fetch sports data.",
        });
      } finally {
        dispatch({
          type: SPORTS_ACTIONS.SET_LOADING,
          payload: false,
        });
      }
    };

    fetchSportsAndOdds();
  }, []);

  return {
    store,
    loading: store.loading,
    error: store.error,
  };
};
