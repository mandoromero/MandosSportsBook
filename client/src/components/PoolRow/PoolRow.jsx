import "./PoolRow.css";

export default function PoolRow({ card, games }) {
  return (
    <tr className="pool-row">
      <td>{card.entry_code}</td>
      <td>{card.first_name}</td>
      <td>{card.last_name}</td>

      {games.map((game) => {
        const pick = card.picks?.[game.game_id]; // JSONB lookup

        const pickedTeam =
          pick === "H"
            ? game.home_team
            : pick === "A"
            ? game.away_team
            : "-";

        return (
          <td key={game.game_id} className="pool-cell">
            {pickedTeam}
          </td>
        );
      })}

      <td>{card.monday_total_points}</td>
    </tr>
  );
}
