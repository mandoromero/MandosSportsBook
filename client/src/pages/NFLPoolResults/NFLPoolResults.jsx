import { useEffect, useState } from "react";
import "../NFLPoolResults/NFLPoolResults.css";

export default function NFLPoolResults({ token }) {
  const [cards, setCards] = useState([]);
  const [games, setGames] = useState([]);

  // Fetch all picks + member info
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/picks/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCards(data);
      } catch (err) {
        console.error("Error fetching results:", err);
      }
    };

    fetchResults();
  }, [token]);

  // Fetch all NFL games (needed to map game_id → team names)
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/nfl/games", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setGames(data.games || []);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };

    fetchGames();
  }, [token]);

  // Build lookup table: game_id → { away, home }
  const gameLookup = {};
  games.forEach((g) => {
    gameLookup[g.id] = {
      away: g.away_team,
      home: g.home_team,
    };
  });

  // Sort games by kickoff time so columns appear in order
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
  );

  return (
    <div className="results-container">
      <h1 className="results-title">NFL Pool Results</h1>

      <table className="results-table">
        <thead>
          <tr>
            <th>Entry Code</th>
            <th>First Name</th>
            <th>Last Name</th>

            {/* Dynamic game columns */}
            {sortedGames.map((game) => (
              <th key={game.id}>
                {game.away_team} vs {game.home_team}
              </th>
            ))}

            <th>MNF Total</th>
          </tr>
        </thead>

        <tbody>
          {cards.map((card) => (
            <tr key={card.entry_code}>
              <td>{card.entry_code}</td>
              <td>{card.first_name}</td>
              <td>{card.last_name}</td>

              {/* Dynamic picks per game */}
              {sortedGames.map((game) => {
                const pick = card.picks[game.id]; // "H" or "A"

                let pickedTeam = "";
                if (pick === "H") pickedTeam = game.home_team;
                if (pick === "A") pickedTeam = game.away_team;

                return (
                  <td key={game.id}>
                    {pick ? pickedTeam : "-"}
                  </td>
                );
              })}

              <td>{card.monday_total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
