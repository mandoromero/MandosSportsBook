import useGames from "../../hooks/useGames";
import usePicks from "../../hooks/usePicks";
import GameList from "../../components/GameList/GameList";
import ChosenPicks from "../../components/ChosenPicks/ChosenPicks";
import getNFLWeek from "../../components/weekCalculator";
import "./NFLGames.css";
import { useNavigate } from "react-router-dom";

export default function NFLGames() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { games, loading } = useGames(token);
  const { state, selectTeam, setPoints } = usePicks();

  const nflWeek =
    games.length > 0 ? getNFLWeek(new Date(games[0].commence_time)) : null;
  
  const gamesByWeek = games.length > 0
  ? games.reduce((acc, game) => {
      const gameDate = new Date(game.commence_time);
      const week = getNFLWeek(gameDate);

      if (!acc[week]) acc[week] = [];
      acc[week].push(game);

      return acc;
    }, {})
  : {};



  return (
    <div className="nfl-games-container">
      <h1 className="nfl-games-title">NFL Week {nflWeek} Schedule</h1>

      <div className="games-chosen">
        {loading ? (
          <h2>Loading NFL Games...</h2>
        ) : (
          <>
            <GameList
              gamesByWeek={gamesByWeek}
              selectedTeam={state.selectedTeam}
              handleTeamSelect={selectTeam}
            />

            <ChosenPicks
              selectedTeam={state.selectedTeam}
              totalPoints={state.totalPoints}
              setTotalPoints={setPoints}
              nflWeek={nflWeek}
              token={token}
              navigate={navigate}
            />
          </>
        )}
      </div>
    </div>
  );
}
