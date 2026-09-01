import { useState, useEffect } from "react";
import axios from "axios";
import useGames from "../../hooks/useGames";
import ResultsTable from "../../components/ResultsTable/ResultsTable";
import "../NFLPoolResults/NFLPoolResults.css";

export default function NFLPoolResults({ token }) {
  const { games, loading } = useGames(token);
  const [cards, setCards] = useState([]);

  // Hardcode or pass week as a prop — adjust as needed
  const week = 1;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/sports/nfl/results/${week}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Backend returns:
        // { success, games, entries, picks, results }
        setCards(res.data.entries || []);

      } catch (err) {
        console.error("Error fetching NFL pool results:", err);

        // Handle expired token
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    fetchResults();
  }, [token, week]);

  if (loading) return <p>Loading games...</p>;

  return <ResultsTable cards={cards} games={games} />;
}
