import "../GameHeaderRow/GameHeaderRow.css";

export default function GameHeaderRow({ games }) {
  return (
    <tr>
      <th>Entry Code</th>
      <th>First Name</th>
      <th>Last Name</th>

      {games.map((game) => (
        <th key={game.id}>
          {game.away_team} vs {game.home_team}
        </th>
      ))}

      <th>MNF Total</th>
    </tr>
  );
}
