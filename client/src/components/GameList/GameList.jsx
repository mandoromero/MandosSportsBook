import GameItem from "../GameItem/GameItem";
import "../GameList/GameList.css";

export default function GameList({ gamesByWeek, selectedTeam, handleTeamSelect, nflWeek }) {
  const safeWeeks = gamesByWeek || {};

  // ⭐ MUST be above the return
  const groupByDate = (games) => {
    return games.reduce((acc, game) => {
      const date = new Date(game.commence_time).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (!acc[date]) acc[date] = [];
      acc[date].push(game);

      return acc;
    }, {});
  };

  return (
    <div className="game-list-container">
      {Object.keys(safeWeeks).length === 0 ? (
        <p>No NFL games found.</p>
      ) : (
        Object.entries(safeWeeks)
          .filter(([week]) => Number(week) === nflWeek)
          .map(([week, games]) => {
            const gamesByDate = groupByDate(games);

            return (
              <div key={week} className="week-group">
                <div className="week-heading-container">
                  <h2 className="week-heading">Week {week}</h2>
                </div>

                {Object.entries(gamesByDate).map(([date, dateGames]) => (
                  <div key={date} className="date-group">
                    <h3 className="game-date-heading">{date}</h3>

                    {dateGames
                      .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time))
                      .map((game) => (
                        <GameItem
                          key={game.id}
                          game={game}
                          selectedTeam={selectedTeam}
                          handleTeamSelect={handleTeamSelect}
                        />
                      ))}
                  </div>
                ))}
              </div>
            );
          })
      )}
    </div>
  );
}
