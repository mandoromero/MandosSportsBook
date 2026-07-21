import { useEffect, useState } from "react";
import axios from "axios";
import SportsCard from "../../components/SportsCard/SportsCard";
import "../Home/Home.css";

/* =========================
   ONLY ALLOWED SPORTS
========================= */
const ALLOWED_SPORTS = [
  "americanfootball_nfl",
  "baseball_mlb",
  "basketball_nba",
];

/* =========================
   LOCAL STORAGE KEY
========================= */
const CACHE_KEY = "sportsbook_odds";

export default function Home() {

  const [sports, setSports] = useState([]);

  const [oddsData, setOddsData] = useState({});

  /* =========================
     LOAD CACHE FIRST
  ========================= */
  useEffect(() => {

    const cachedOdds =
      localStorage.getItem(CACHE_KEY);

    /* =========================
       USE CACHE
    ========================= */
    if (cachedOdds) {

      console.log("🔥 Using localStorage cache");

      setOddsData(JSON.parse(cachedOdds));

      return;
    }

    /* =========================
       FETCH SPORTS
    ========================= */
    const fetchSports = async () => {

      try {

        const sportsRes = await axios.get(
          "http://localhost:5000/api/sports"
        );

        const filteredSports =
          sportsRes.data.filter((sport) =>
            ALLOWED_SPORTS.includes(sport.key)
          );

        setSports(filteredSports);

        const newOddsData = {};

        /* =========================
           FETCH ODDS
        ========================= */
        for (let i = 0; i < filteredSports.length; i++) {

          const sport = filteredSports[i];

          const oddsRes = await axios.get(
            `http://localhost:5000/api/sports/odds/${sport.key}`
          );

          console.log("All SPORTS:", sportsRes.data)

          newOddsData[sport.key] =
            oddsRes.data;

          // prevent rate limits
          await new Promise((r) =>
            setTimeout(r, 1200)
          );
        }

        /* =========================
           SAVE CACHE
        ========================= */
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(newOddsData)
        );

        setOddsData(newOddsData);

      } catch (err) {

        console.error(
          "Error fetching odds:",
          err
        );
      }
    };

    fetchSports();

  }, []);

  /* =========================
     SPORT TITLES
  ========================= */
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