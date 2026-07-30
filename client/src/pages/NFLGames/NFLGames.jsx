import { useEffect, useState } from "react";
import axios from "axios";
import "../NFLGames/NFLGames.css";
import { useNavigate } from "react-router-dom";
import { useGlobalReducer } from "../../hooks/useGlobalReducer";

export default function NFLGames() {
  const token = localStorage.getItem("token");
  console.log("NFL TOKEN:", token);

  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState("");
  const [selectedTeam, setSelectedTeam] = useState({});
 
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/sports/odds/americanfootball_nfl",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
        console.error(
          "Error fetching NFL games:",
          err
        );

        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [token]);

  /* =========================
     DETERMINE CURRENT NFL WEEK
  ========================= */

  let weeklyGames = [];

  if (games.length > 0) {
    const firstGameDate = new Date(
      games[0].commence_time
    );

    const weekStart = new Date(firstGameDate);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    weeklyGames = games.filter((game) => {
      const gameDate = new Date(
        game.commence_time
      );

      return (
        gameDate >= weekStart &&
        gameDate <= weekEnd
      );
    });
  }

  /* =========================
     GROUP GAMES BY DATE
  ========================= */

  const gamesByDate = weeklyGames.reduce(
    (acc, game) => {
      const date = new Date(
        game.commence_time
      ).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push(game);

      return acc;
    },
    {}
  );

  const handleTeamSelect = (game, pick) => {
    const weekday = new Date(game.commence_time).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const isMondayNight = weekday === "Monday";
    console.log("Game:", game.id);
    console.log("Pick:", pick);

    // Update the UI immediately
    setSelectedTeam((prev) => ({
      ...prev,
      [game.id]: {
        pick,
        team: pick === "A" ? game.away_team : game.home_team,
        commence_time: game.commence_time,
        isMondayNight,
      },
    }));

    console.log(
      game.away_team,
      "vs",
      game.home_team
    );

    console.log(game.commence_time);

    console.log(
      new Date(game.commence_time).toLocaleString("en-US")
    );
  };

   


  if (loading) {
    return <h2>Loading NFL Games...</h2>;
  }

  /*========================
      SUBMIT PICKS
  ========================*/
  const handleSubmitPicks = async () => {
    console.log("Selected Teams:", selectedTeam);
    try {
      const picks = Object.entries(selectedTeam).map(([gameId, pick]) => ({
        game_id: gameId,
        picked_team: pick.team,
      }));

      console.log("Sending token:", token);

      console.log("Headers:", {
        Authorization: `Bearer ${token}`,
      });

      console.log("Payload:", {
        week: 1,
        mondayTotalPoints: totalPoints,
        picks,
      });

      await axios.post(
        "http://localhost:5001/api/member-picks",
        {
          week: 1,
          mondayTotalPoints: totalPoints,
          picks,
        },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      console.log("Picks submitted:", res.data);
    
      alert("Picks submittted successfully!");

      navigate("/nfl-pool-results");

    } catch (err) {
      console.error("Error submitting picks:", err);

      alertz9
        err.response?.data?.message ||
        "Unable to submit picks."
    }
  };

  return (
    <div className="nfl-games-container">
      <h1 className="nfl-games-title">
        NFL Weekly Schedule
      </h1>

      <div className="teams-container">
        <div className="pick-a-team">
          {Object.keys(gamesByDate).length === 0 ? (
            <p>No NFL games found.</p>
          ) : (
            Object.entries(gamesByDate).map(
              ([date, gamesForDate]) => (
                <div
                  key={date}
                  className="date-group"
                >
                  <h2 className="game-date-heading">
                    {date}
                  </h2>
                    
                  {gamesForDate.map((game) => {

                    return (
                      <div
                        key={game.id}
                        className="nfl-game"
                      >
                        <span className="game-id">
                          Game ID: {game.id}
                        </span>

                        <div className="game-time">
                          {new Date(game.commence_time).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </div>

                        <div className="game-matchup">
                          <label className="team-container">
                            <span className="team">
                              {game.away_team}
                            </span>

                            <input
                              type="radio"
                              name={game.id}
                              value={game.away_team}
                              checked={
                                selectedTeam[game.id]?.pick === "A"
                              }
                              onChange={() =>
                                handleTeamSelect(game, "A")
                              }
                            />
                          </label>

                          <span className="at">vs.</span>

                          <label className="team-container">
                          <span className="team">
                            {game.home_team}
                            </span>

                            <input
                              type="radio"
                              name={game.id}
                              value={game.home_team}
                              checked={
                                selectedTeam[game.id]?.pick === "H"
                              }
                              onChange={() =>
                                handleTeamSelect(game, "H")
                              }
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )
          )}
          
          </div>

          <div className="chosen-teams">
            <h2>Your Picks</h2>

            {Object.keys(selectedTeam).length === 0 ? (
              <p>No teams selected.</p>
            ) : (
              Object.entries(selectedTeam)
                .sort(([, a], [, b]) => {
                // Always move the Monday Night game to the bottom
                if (a.isMondayNight && !b.isMondayNight) return 1;
                if (!a.isMondayNight && b.isMondayNight) return -1;

                // Otherwise sort by game time
                return (
                  new Date(a.commence_time) -
                  new Date(b.commence_time)
                );
              })
              .map(([gameId, team]) => (
                <div key={gameId} className="chosen-team">
                  <div className="picked-game-id">
                    Game ID: <strong>{gameId}</strong>
                  </div>

                  <div className="picked-team">
                    {team.team}
                  </div>

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
                        onChange={(e) =>
                          setTotalPoints(e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))
            )}
            <div className="nfl-game-btn-container">
              <button 
                className="nfl-game-btn"
                onClick={handleSubmitPicks}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }