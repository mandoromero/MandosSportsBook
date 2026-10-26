
import "../SportsCard/SportsCard.css";
import { useNavigate } from "react-router-dom";

export default function SportsCard({ sport, games = [] }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  const safeGames = Array.isArray(games) ? games : [];

  const title = sport?.title || "Unknown Sport";

  const formatOdds = (price) => {
    if (price == null) return "N/A";
    return price > 0 ? `+${price}` : `${price}`;
  };

  const formatDate = (date) => {
    if (!date) return "Date TBD";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date TBD";
    }

    return parsedDate.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getMoneylineOdds = (game, teamName) => {
    for (const bookmaker of game.bookmakers ?? []) {
      const market = bookmaker.markets?.find(
        (item) => item.key === "h2h"
      );

      const outcome = market?.outcomes?.find(
        (item) => item.name === teamName
      );

      if (outcome?.price != null) {
        return outcome.price;
      }
    }

    return null;
  };

  return (
    <div className="sports-card" onClick={handleClick}>
      <h2 className="sports-title">{title}</h2>

      <div className="sports-games">
        {safeGames.length > 0 ? (
          safeGames.map((game) => (
            <div className="game-preview" key={game.id}>
              <div className="game-date">
                {formatDate(game.commence_time)}
              </div>

              <div className="team-row">
                <span className="team-name">
                  {game.away_team || "Away team TBD"}
                </span>

                <span className="money-line">
                  Odds: {formatOdds(
                    getMoneylineOdds(game, game.away_team)
                  )}
                </span>
              </div>

              <span className="vs">vs.</span>

              <div className="team-row">
                <span className="team-name">
                  {game.home_team || "Home team TBD"}
                </span>

                <span className="money-line">
                  Odds: {formatOdds(
                    getMoneylineOdds(game, game.home_team)
                  )}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-games">
            No games or odds currently available.
          </p>
        )}
      </div>
    </div>
  );
}
