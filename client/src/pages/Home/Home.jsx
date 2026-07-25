import { useEffect, useState } from "react";
import axios from "axios";
import SportsCard from "../../components/SportsCard/SportsCard";
import "./Home.css";

const ALLOWED_SPORTS = [
  "americanfootball_nfl",
  "baseball_mlb",
  "basketball_nba",
];

const CACHE_KEY = "sportsbook_odds";

export default function Home() {
  const [oddsData, setOddsData] = useState({});

  useEffect(() => {
    const cachedOdds = localStorage.getItem(CACHE_KEY);

    if (cachedOdds) {
      console.log("🔥 Using localStorage cache");
      setOddsData(JSON.parse(cachedOdds));
      return;
    }

    const fetchSports = async () => {
      try {
        const sportsRes = await axios.get(
          "http://localhost:5001/api/sports"
        );

        const filteredSports = sportsRes.data.filter((sport) =>
          ALLOWED_SPORTS.includes(sport.key)
        );

        const newOddsData = {};

        for (const sport of filteredSports) {
          const oddsRes = await axios.get(
            `http://localhost:5001/api/sports/odds/${sport.key}`
          );

          newOddsData[sport.key] = oddsRes.data;

          await new Promise((resolve) =>
            setTimeout(resolve, 1200)
          );
        }

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(newOddsData)
        );

        setOddsData(newOddsData);
      } catch (err) {
        console.error("Error fetching odds:", err);
      }
    };

    fetchSports();
  }, []);

  const SPORT_TITLES = {
    americanfootball_nfl: "NFL",
    baseball_mlb: "MLB",
    basketball_nba: "NBA",
  };

  return (
    <div id="home-container">
      <h1 className="main-title">
        Welcome to Mando's Sports Book!
      </h1>

      <div className="sport-card-container">
        {Object.keys(oddsData).map((sportKey) => (
          <SportsCard
            key={sportKey}
            title={SPORT_TITLES[sportKey]}
            sport={sportKey}
            games={oddsData[sportKey] || []}
          />
        ))}
      </div>
    </div>
  );
}