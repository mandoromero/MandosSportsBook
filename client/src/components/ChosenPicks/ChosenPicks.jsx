import axios from "axios";
import "../ChosenPicks/ChosenPicks.css";

export default function ChosenPicks({
  selectedTeam,
  totalPoints,
  setTotalPoints,
  nflWeek,
  token,
  navigate,
}) {
  const handleSubmitPicks = async () => {
    try {
      const picks = Object.entries(selectedTeam).map(([gameId, pick]) => ({
        game_id: gameId,
        picked_team: pick.team,
      }));

      await axios.post(
        "http://localhost:5001/api/member-picks",
        {
          week: nflWeek,
          mondayTotalPoints: totalPoints,
          picks,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Picks submitted successfully!");
      navigate("/nfl-pool-results");
    } catch (err) {
      alert("Unable to submit picks.");
    }
  };

  return (
    <div className="chosen-picks-container">
      <div className="your-picks-heading-container">
        <h2 className="your-picks-heading">Your Picks</h2>
      </div>
    

      {Object.keys(selectedTeam).length === 0 ? (
        <p>No teams selected.</p>
      ) : (
        Object.entries(selectedTeam).map(([gameId, team]) => (
          <div key={gameId} className="chosen-team">
            <div className="picked-game-id">
              Game ID: <strong>{gameId}</strong>
            </div>

            <div className="picked-team">{team.team}</div>

            {team.isMondayNight && (
              <div className="total-points-container">
                <label>Monday Night Total Points</label>
                <input
                  className="total-points-input"
                  type="number"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(e.target.value)}
                />
              </div>
            )}
          </div>
        ))
      )}

      {Object.values(selectedTeam).some(team => team.isMondayNight) && (
        <button className="nfl-game-btn" onClick={handleSubmitPicks}>
          Submit
        </button>
      )}
    </div>
  );
}
