import "../PoolTable/PoolTable.css";

function getPickedTeam(savedPick, game) {
  const rawPick =
    typeof savedPick === "string"
      ? savedPick
      : savedPick?.pick;

  if (typeof rawPick !== "string" || !rawPick.trim()) {
    return "-";
  }

  const pick = rawPick.trim().toLowerCase();
  const home = game.home_team?.trim();
  const away = game.away_team?.trim();

  // Support H/A codes and full team names.
  if (
    pick === "h" ||
    pick === "home" ||
    pick === home?.toLowerCase()
  ) {
    return home;
  }

  if (
    pick === "a" ||
    pick === "away" ||
    pick === away?.toLowerCase()
  ) {
    return away;
  }

  return "-";
}

export default function PoolTable({
  cards = [],
  games = [],
  week,
}) {
  const sortedGames = [...games].sort(
    (a, b) =>
      new Date(a.commence_time) -
      new Date(b.commence_time)
  );

  const displayWeek =
    week ?? cards[0]?.week ?? games[0]?.week ?? 3;

  return (
    <div className="pool-table-container">
      <h2>Week {displayWeek} NFL Pool</h2>

      {sortedGames.length === 0 ? (
        <p>
          No games found for Week {displayWeek}.
        </p>
      ) : (
        <table className="pool-table">
          <thead>
            <tr className="pool-header-row">
              <th className="rotate">Entry Code</th>
              <th className="rotate">First Name</th>
              <th className="rotate">Last Name</th>

              {sortedGames.map((game) => (
                <th
                  key={game.game_id}
                  className="rotate"
                >
                  <div className="header-game">
                    <div className="team">
                      {game.home_team}
                    </div>
                    <div className="vs">vs.</div>
                    <div className="team">
                      {game.away_team}
                    </div>
                  </div>
                </th>
              ))}

              <th className="rotate">MNF Total</th>
            </tr>
          </thead>

          <tbody>
            {cards.map((card) => (
              <tr key={card.card_id}>
                <td>{card.entry_code}</td>
                <td>{card.first_name}</td>
                <td>{card.last_name}</td>

                {sortedGames.map((game) => (
                  <td key={game.game_id}>
                    {getPickedTeam(
                      card.picks?.[game.game_id],
                      game
                    )}
                  </td>
                ))}

                <td>
                  {card.monday_total_points ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}