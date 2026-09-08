import "./PoolHeader.css";

export default function PoolHeader({ games }) {
  return (
    <tr className="pool-header-row">
      <th className="rotate">Entry Code</th>
      <th className="rotate">First</th>
      <th className="rotate">Last</th>

      {games.map((game) => (
        <th key={game.game_id} className="rotate rotate-btt">
          <div className="header-game">
            <span className="team">{game.home_team}</span>
            <span className="v-s">vs</span>
            <span className="team">{game.away_team}</span>
          </div>
        </th>
      ))}

      <th>MNF Total</th>
    </tr>
  );
}
