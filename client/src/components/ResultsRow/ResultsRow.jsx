import "../ResultsRow/ResultsRow.css";

export default function ResultsRow({ card, games }) {
  return (
    <tr>
      <td>{card.entry_code}</td>
      <td>{card.first_name}</td>
      <td>{card.last_name}</td>

      {games.map((game) => {
        const pick = card.picks[game.id];
        const pickedTeam =
          pick === "H"
            ? game.home_team
            : pick === "A"
            ? game.away_team
            : "-";

        return <td key={game.id}>{pickedTeam}</td>;
      })}

      <td>{card.monday_total_points}</td>
    </tr>
  );
}
