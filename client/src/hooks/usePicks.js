import { useReducer } from "react";

const initialState = {
  selectedTeam: {},
  totalPoints: ""
};

function picksReducer(state, action) {
  switch (action.type) {
    case "SELECT_TEAM":
      return {
        ...state,
        selectedTeam: action.payload
      };


    case "SET_POINTS":
      return { ...state, totalPoints: action.payload };

    default:
      return state;
  }
}

export default function usePicks() {
  const [state, dispatch] = useReducer(picksReducer, initialState);

  const selectTeam = (game, pick) => {
    const currentPick = state.selectedTeam[game.id]?.pick;

    console.log("Current pick:", currentPick);
    console.log("SelectedTeam BEFORE:", state.selectedTeam);

    // ⭐ If user clicks the SAME team again → unselect it
    if (currentPick === pick) {
      const updated = { ...state.selectedTeam };
      delete updated[game.id];

      console.log("Updated AFTER delete:", updated);

      dispatch({
        type: "SELECT_TEAM",
        payload: updated
      });

      return;
    }

    // ⭐ Otherwise → set the new pick
    const weekday = new Date(game.commence_time).toLocaleDateString("en-US", {
      weekday: "long"
    });

    const isMondayNight = weekday === "Monday";

    const updated = {
      ...state.selectedTeam,
      [game.id]: {
        pick,
        team: pick === "A" ? game.away_team : game.home_team,
        commence_time: game.commence_time,
        isMondayNight
      }
    };

    console.log("Updated AFTER new pick:", updated);

    dispatch({
      type: "SELECT_TEAM",
      payload: updated
    });
  };


  const setPoints = (points) => {
    dispatch({ type: "SET_POINTS", payload: points });
  };

  return { state, selectTeam, setPoints };
}
