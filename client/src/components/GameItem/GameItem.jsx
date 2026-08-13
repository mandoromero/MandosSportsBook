export default function GameItem({ game, selectedTeam, handleTeamSelect }) {
  return (
    <div className="nfl-game">
      <span className="game-id">Game ID: {game.id}</span>

      <div classNames="game-time">
        {new Date(game.commence_time).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}
      </div>

      <div className="game-matchup">
        <label className="team-container">
          <span className="team">{game.away_team}</span>
          <input
            type="radio"
            name={game.id}
            checked={selectedTeam[game.id]?.pick === "A"}
            onChange={() => handleTeamSelect(game, "A")}
          />
        </label>

        <span className="at">vs.</span>

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
