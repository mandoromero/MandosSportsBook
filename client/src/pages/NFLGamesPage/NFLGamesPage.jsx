import { useEffect, useState } from "react";
import axios from "axios";
import GamesByDate from "./GamesByDate";
import ChosenPicks from "./ChosenPicks";

export default function NFLGamesPage() {
  const token = localStorage.getItem("token");

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [totalPoints, setTotalPoints] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/sports/odds/americanfootball_nfl",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sorted = [...res.data].sort(
          (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
        );

        setGames(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token]);

  const getNFLWeek = (gameDate) => {
    const WEEK1_START = new Date("2026-09-08T00:00:00");
    const diffDays = Math.floor((gameDate - WEEK1_START) / 86400000);
    return diffDays < 0 ? null : Math.floor(diffDays / 7) + 1;
  };

  const nflWeek =
    games.length > 0 ? getNFLWeek(new Date(games[0].commence_time)) : null;

  const gamesByDate = games.reduce((acc, game) => {
    const date = new Date(game.commence_time).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    acc[date] = acc[date] || [];
    acc[date].push(game);
    return acc;
  }, {});

  const handleTeamSelect = (game, pick) => {
    const weekday = new Date(game.commence_time).toLocaleDateString("en-US", {
      weekday: "long",
    });

    setSelectedTeam((prev) => ({
      ...prev,
      [game.id]: {
        pick,
        team: pick === "A" ? game.away_team : game.home_team,
        commence_time: game.commence_time,
        isMondayNight: weekday === "Monday",
      },
    }));
  };

  return (
    <div className="nfl-games-container">
      <h1>NFL Weekly Schedule</h1>

      {loading ? (
        <h2>Loading NFL Games...</h2>
      ) : (
        <>
          <GamesByDate
            gamesByDate={gamesByDate}
            selectedTeam={selectedTeam}
            onSelect={handleTeamSelect}
          />

          <ChosenPicks
            selectedTeam={selectedTeam}
            totalPoints={totalPoints}
            setTotalPoints={setTotalPoints}
            nflWeek={nflWeek}
          />
        </>
      )}
    </div>
  );
}
