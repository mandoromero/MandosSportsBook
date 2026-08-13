import GameItem from "../GameItem/GameItem";
import "../GameList/GameList.css";

export default function GameList({ gamesByDate, selectedTeam, handleTeamSelect }) {
  return (
    <div className="game-list-container">
      {Object.keys(gamesByDate).length === 0 ? (
        <p>No NFL games found.</p>
      ) : (
        Object.entries(gamesByDate).map(([date, games]) => (
          <div key={date} className="date-group">
            <h2 className="game-date-heading">{date}</h2>

            {games.map((game) => (
              <GameItem
                key={game.id}
                game={game}
                selectedTeam={selectedTeam}
                handleTeamSelect={handleTeamSelect}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
