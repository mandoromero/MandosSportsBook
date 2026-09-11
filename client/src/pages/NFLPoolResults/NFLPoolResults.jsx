import { useState, useEffect } from "react";
import axios from "axios";
import useGames from "../../hooks/useGames";
import PoolTable from "../../components/PoolTable/PoolTable";
import "./NFLPoolResults.css";

export default function NFLPoolResults({ token }) {
  const { games, loading } = useGames(token);
  const [cards, setCards] = useState([]);

  // Hardcoded week for now — you can make this dynamic later
  const week = 1;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/nfl/results/${week}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setCards(res.data.entries || []);

      } catch (err) {
        console.error("Error fetching NFL pool results:", err);

        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    };

    fetchResults();
  }, [token, week]);

  if (loading) return <p>Loading games...</p>;

  return (
    <div classname="pool-results-container">
      <PoolTable cards={cards} games={games} />
    </div>
  );
}
