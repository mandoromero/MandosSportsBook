import "../PoolTable/PoolTable.css";

export default function PoolTable({ cards, games }) {
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
  );

  return (
    <table className="pool-table">
      <thead>
        <tr className="pool-header-row">
          <th className="rotate">Entry Code</th>
          <th className="rotate">First Name</th>
          <th className="rotate">Last Name</th>

          {sortedGames.map((game) => (
            <th key={game.game_id} className="rotate">
              <div className="header-game">
                <div className="team">{game.home_team}</div>
                <div className="vs">vs.</div>
                <div className="team">{game.away_team}</div>
              </div>
            </th>
          ))}

          <th className="rotate">MNF Total</th>
        </tr>
      </thead>

      <tbody>
        {cards.map((card) => (
          <tr key={card.entry_code}>
            <td>{card.entry_code}</td>
            <td>{card.first_name}</td>
            <td>{card.last_name}</td>

            {sortedGames.map((game) => {
              const pick = card.picks[game.game_id];
              const pickedTeam =
                pick === "H"
                  ? game.home_team
                  : pick === "A"
                  ? game.away_team
                  : "-";

              return <td key={game.game_id}>{pickedTeam}</td>;
            })}

            <td>{card.monday_total_points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
