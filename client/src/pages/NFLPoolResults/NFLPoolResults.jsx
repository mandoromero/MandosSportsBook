import { useState, useEffect } from "react";
import axios from "axios";
import useGames from "../../hooks/useGames";
import PoolTable from "../../components/PoolTable/PoolTable";
import "../NFLPoolResults/NFLPoolResults.css";

export default function NFLPoolResults({ token }) {
  const { games, loading } = useGames(token);
  const [cards, setCards] = useState([]);

  // Hardcoded week for now — make dynamic later
  const week = 1;

  useEffect(() => {
    if (!token) return;

    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/nfl/results/${week}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Backend returns: { success, games, entries, picks, results }
        setCards(res.data.entries || []);

      } catch (err) {
        console.error("Error fetching NFL pool results:", err);

        // Handle expired token
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    fetchResults();
  }, [token, week]);

  if (loading) return <p>Loading games...</p>;

  return (
    <div className="pool-results-container">
      <PoolTable cards={cards} games={games} />
    </div>
  );
}
