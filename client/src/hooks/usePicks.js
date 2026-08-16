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

    // ⭐ If user clicks the SAME team again → unselect it
    if (currentPick === pick) {
      const updated = { ...state.selectedTeam };
      delete updated[game.id];

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

    dispatch({
      type: "SELECT_TEAM",
      payload: {
        ...state.selectedTeam,
        [game.id]: {
          pick,
          team: pick === "A" ? game.away_team : game.home_team,
          commence_time: game.commence_time,
          isMondayNight
        }
      }
    });
  };

  const setPoints = (points) => {
    dispatch({ type: "SET_POINTS", payload: points });
  };

  return { state, selectTeam, setPoints };
}
