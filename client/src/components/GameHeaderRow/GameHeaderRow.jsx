import "../GameHeaderRow/GameHeaderRow.css";

export default function GameHeaderRow({ games }) {
  return (
    <tr>
      <th className="cell">Entry Code</th>
      <th className="cell">First Name</th>
      <th className="cell">Last Name</th>

      {games.map((game) => (
        <th className="cell" key={game.id}>
          {game.away_team} vs {game.home_team}
        </th>
      ))}

      <th className="cell">MNF Total</th>
    </tr>
  );
}
