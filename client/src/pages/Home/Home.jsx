import { useEffect } from "react";
import axios from "axios";
import { useGlobalReducer, ACTIONS } from "../../hooks/useGlobalReducer";
import SportsCard from "../../components/SportsCard/SportsCard";
import "../Home/Home.css";

export default function Home() {
  const { store, dispatch } = useGlobalReducer();
  const { sports, oddsBySport = {} } = store;

  // 👇 Your function lives here
  const fetchSportsAndOdds = async () => {
    try {
      // 1. Fetch all sports
      const sportsRes = await axios.get("http://localhost:5001/sports");

      dispatch({
        type: ACTIONS.SET_SPORTS,
        payload: sportsRes.data,
      });

      // 2. Filter supported sports
      const playableSports = sportsRes.data.filter((s) =>
        ["americanfootball_nfl", "basketball_nba", "baseball_mlb", "icehockey_nhl"].includes(s.key)
      );

      // 3. Loop through supported sports
      for (const sport of playableSports) {
        try {
          const oddsRes = await axios.get(
            `http://localhost:5001/sports/odds/${sport.key}`
          );

          dispatch({
            type: ACTIONS.SET_ODDS,
            payload: { key: sport.key, games: oddsRes.data },
          });
        } catch (err) {
          console.error(`Error fetching odds for ${sport.key}:`, err.message);
        }
      }
    } catch (err) {
      console.error("Error fetching sports list:", err.message);
    }
  };

  // 👇 Call it when the component mounts
  useEffect(() => {
    fetchSportsAndOdds();
  }, []);

  return (
    <div className="home-container">
      <h1 className="main-title">Welcome to Mando's Sports Book</h1>
      <div className="sports-card-container">
        {sports.map((sport) => {
          const games = oddsBySport[sport.key] ?? [];

          return (
            <SportsCard
              key={sport.key}
              title={`${sport.title} - ${sport.group}`}
              sport={sport.key}
              games={games}
            />
          );
        })}
      </div>
    </div>
  );
}
