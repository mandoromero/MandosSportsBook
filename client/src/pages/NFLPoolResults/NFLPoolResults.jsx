
import { useState, useEffect } from "react";
import axios from "axios";
import PoolTable from "../../components/PoolTable/PoolTable";
import "../NFLPoolResults/NFLPoolResults.css";

export default function NFLPoolResults() {
  const token = localStorage.getItem("token");
  const week = 3;

  const [games, setGames] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter games to show only the selected week
  const weekGames = games.filter(
    (game) => Number(game.week) === Number(week)
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://localhost:5001/api/nfl/results/${week}?season=2026`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("FULL RESULTS API RESPONSE:", res.data);
        console.log("GAMES:", res.data.games);
        console.log("ENTRIES:", res.data.entries);
        console.log(
          "FIRST ENTRY PICKS:",
          res.data.entries?.[0]?.picks
        );

        setGames(res.data.games || []);
        setCards(res.data.entries || []);
      } catch (err) {
        console.error("❌ Error fetching NFL pool results:", err);
        console.error("Response:", err.response?.data);

        setError("Unable to load NFL pool results.");

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token, week]);

  if (loading) {
    return <p>Loading NFL pool results...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="pool-results-container">
      <PoolTable cards={cards} games={weekGames} />
    </div>
  );
}
