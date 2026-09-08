import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";
import { ACTIONS } from "../../hooks/useGlobalReducer";
import SportsCard from "../../components/SportsCard/SportsCard";
import "./Home.css";

export default function Home() {
  const { store, dispatch } = useGlobalReducer();
  const { sports } = store;

  const fetchSports = async () => {
    try {
      // 1. Fetch sports list
      const sportsRes = await axios.get("http://localhost:5001/sports");

      dispatch({
        type: ACTIONS.SET_SPORTS,
        payload: sportsRes.data
      });

      // 2. Fetch odds for first sport
      const firstSport = sportsRes.data[0].key;

      const oddsRes = await axios.get(
        `http://localhost:5001/sports/odds/${firstSport}`
      );

      dispatch({
        type: ACTIONS.SET_NFL_GAMES,
        payload: oddsRes.data
      });

    } catch (err) {
      console.error("Error fetching odds:", err);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return (
    <div>
      <SportsCard sports="sports" />
    </div>
  );
}