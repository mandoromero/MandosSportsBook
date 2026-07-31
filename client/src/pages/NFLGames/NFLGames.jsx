import { useEffect, useState } from "react";
import axios from "axios";
import "../NFLGames/NFLGames.css";
import { useNavigate } from "react-router-dom";

export default function NFLGames() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState("");
  const [selectedTeam, setSelectedTeam] = useState({});

  /* ============================================================
     FETCH NFL GAMES
  ============================================================ */
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/sports/odds/americanfootball_nfl",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sortedGames = Array.isArray(res.data)
          ? [...res.data].sort(
              (a, b) =>
                new Date(a.commence_time) -
                new Date(b.commence_time)
            )
          : [];

        setGames(sortedGames);
      } catch (err) {
        console.error("Error fetching NFL games:", err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token]);

  /* ============================================================
     NFL WEEK CALCULATION (Wed → Tue schedule)
     Week 1 starts: Sept 8, 2026
  ============================================================ */
  function getNFLWeek(gameDate) {
    const WEEK1_START = new Date("2026-09-08T00:00:00");

    const diffMs = gameDate - WEEK1_START;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;

    return Math.floor(diffDays / 7) + 1;
  }

  let nflWeek = null;

  if (games.length > 0) {
    const firstGameDate = new Date(games[0].commence_time);
    nflWeek = getNFLWeek(firstGameDate);
    console.log("Computed NFL Week:", nflWeek);
  }

  /* ============================================================
     GROUP GAMES BY DATE
  ============================================================ */
  const gamesByDate = games.reduce((acc, game) => {
    const date = new Date(game.commence_time).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!acc[date]) acc[date] = [];
    acc[date].push(game);

    return acc;
  }, {});

  /* ============================================================
     HANDLE TEAM SELECTION
  ============================================================ */
  const handleTeamSelect = (game, pick) => {
    const weekday = new Date(game.commence_time).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const isMondayNight = weekday === "Monday";

    setSelectedTeam((prev) => ({
      ...prev,
      [game.id]: {
        pick,
        team: pick === "A" ? game.away_team : game.home_team,
        commence_time: game.commence_time,
        isMondayNight,
      },
    }));
  };

  if (loading) {
    return <h2>Loading NFL Games...</h2>;
  }

  /* ============================================================
     SUBMIT PICKS
  ============================================================ */
  const handleSubmitPicks = async () => {
    try {
      const picks = Object.entries(selectedTeam).map(([gameId, pick]) => ({
        game_id: gameId,
        picked_team: pick.team,
      }));

      const res = await axios.post(
        "http://localhost:5001/api/member-picks",
        {
          week: nflWeek,
          mondayTotalPoints: totalPoints,
          picks,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Picks submitted:", res.data);
      alert("Picks submitted successfully!");
      navigate("/nfl-pool-results");
    } catch (err) {
      console.error("Error submitting picks:", err);

      alert(
        err.response?.data?.message ||
        "Unable to submit picks."
      );
    }
  };

  /* ============================================================
     RENDER UI
  ============================================================ */
  return (
    <div className="nfl-games-container">
      <h1 className="nfl-games-title">NFL Weekly Schedule</h1>

      <div className="teams-container">
        <div className="pick-a-team">
          {Object.keys(gamesByDate).length === 0 ? (
            <p>No NFL games found.</p>
          ) : (
            Object.entries(gamesByDate).map(([date, gamesForDate]) => (
              <div key={date} className="date-group">
                <h2 className="game-date-heading">{date}</h2>

                {gamesForDate.map((game) => (
                  <div key={game.id} className="nfl-game">
                    <span className="game-id">Game ID: {game.id}</span>

                    <div className="game-time">
                      {new Date(game.commence_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>

                    <div className="game-matchup">
                      <label className="team-container">
                        <span className="team">{game.away_team}</span>
                        <input
                          type="radio"
                          name={game.id}
                          value={game.away_team}
                          checked={selectedTeam[game.id]?.pick === "A"}
                          onChange={() => handleTeamSelect(game, "A")}
                        />
                      </label>

                      <span className="at">vs.</span>

                      <label className="team-container">
                        <span className="team">{game.home_team}</span>
                        <input
                          type="radio"
                          name={game.id}
                          value={game.home_team}
                          checked={selectedTeam[game.id]?.pick === "H"}
                          onChange={() => handleTeamSelect(game, "H")}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="chosen-teams">
          <h2>Your Picks</h2>

          {Object.keys(selectedTeam).length === 0 ? (
            <p>No teams selected.</p>
          ) : (
            Object.entries(selectedTeam)
              .sort(([, a], [, b]) => {
                if (a.isMondayNight && !b.isMondayNight) return 1;
                if (!a.isMondayNight && b.isMondayNight) return -1;
                return new Date(a.commence_time) - new Date(b.commence_time);
              })
              .map(([gameId, team]) => (
                <div key={gameId} className="chosen-team">
                  <div className="picked-game-id">
                    Game ID: <strong>{gameId}</strong>
                  </div>

                  <div className="picked-team">{team.team}</div>

                  {team.isMondayNight && (
                    <div className="total-points-container">
                      <label
                        className="points-label"
                        htmlFor={`total-points-${gameId}`}
                      >
                        Monday Night Total Points
                      </label>

                      <input
                        id={`total-points-${gameId}`}
                        className="total-points"
                        type="number"
                        value={totalPoints}
                        onChange={(e) => setTotalPoints(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))
          )}

          <div className="nfl-game-btn-container">
            <button className="nfl-game-btn" onClick={handleSubmitPicks}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
