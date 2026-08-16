import "../GameItem/GameItem.css";

export default function GameItem({ game, selectedTeam, handleTeamSelect }) {
  return (
    <div className="game-item-container">
      <span className="game-id">Game ID: {game.id}</span>

      <p className="game-time">
        {new Date(game.commence_time).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>

      <div className="game-matchup">
        <label className="team-container">
          <span className="team">{game.away_team}</span>
          <input
          className="team-input"
            type="radio"
            name={game.id}
            checked={selectedTeam[game.id]?.pick === "A"}
            onChange={() => handleTeamSelect(game, "A")}
          />
        </label>

        <span className="vs">vs.</span>

        <label className="team-container">
          <span className="team">{game.home_team}</span>
          <input
            type="radio"
            name={game.id}
            checked={selectedTeam[game.id]?.pick === "H"}
            onChange={() => handleTeamSelect(game, "H")}
          />
        </label>
      </div>
    </div>
  );
}
