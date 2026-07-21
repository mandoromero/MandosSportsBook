import "../SportsCard/SportsCard.css";
import { useNavigate } from "react-router-dom";

export default function SportsCard({
  title,
  sport,
  games = [],
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  const safeGames = Array.isArray(games)
    ? games
    : [];

  return (
    <div
      className="sports-card"
      onClick={handleClick}
    >
      <h2 className="sports-title">
        {title}
      </h2>

      <div className="sports-games">
        {safeGames.map((game, index) => {
          const home = game.home_team;
          const away = game.away_team;
          const date = game.commence_time;

          const bookmaker =
            game.bookmakers?.[0];

          const h2hMarket =
            bookmaker?.markets?.find(
              (m) => m.key === "h2h"
            );

          const homeOdds =
            h2hMarket?.outcomes?.find(
              (o) => o.name === home
            )?.price;

          const awayOdds =
            h2hMarket?.outcomes?.find(
              (o) => o.name === away
            )?.price;

          return (
            <div
              key={game.id}
              className="game-preview"
            >
              <div className="game-date">
                {date
                  ? new Date(
                      date
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )
                  : "TBD"}
              </div>

              <div className="team-row">
                <span className="team-name">
                  {away}
                </span>

                <span className="money-line">
                  {awayOdds ?? "N/A"}
                </span>
              </div>
              
              <span className="vs">
                Vs.
              </span>

              <div className="team-row">
                <span className="team-name">
                  {home}
                </span>

                <span className="money-line">
                  {homeOdds ?? "N/A"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}