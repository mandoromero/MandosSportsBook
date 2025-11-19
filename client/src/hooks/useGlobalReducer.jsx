// src/hooks/useGlobalReducer.jsx
import React, { createContext, useContext, useReducer } from "react";

// ------------- Initial Global State -------------
const initialState = {
  user: null,
  isAuthLoading: false,
  theme: "light",
  message: "",
};

// ------------- Action Types ----------------------
export const ACTIONS = {
  SET_USER: "SET_USER",
  CLEAR_USER: "CLEAR_USER",
  SET_AUTH_LOADING: "SET_AUTH_LOADING",
  SET_THEME: "SET_THEME",
  SET_MESSAGE: "SET_MESSAGE",
  CLEAR_MESSAGE: "CLEAR_MESSAGE",
};

// ------------- Reducer ---------------------------
function globalReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };

    case ACTIONS.CLEAR_USER:
      return { ...state, user: null };

    case ACTIONS.SET_AUTH_LOADING:
      return { ...state, isAuthLoading: action.payload };

    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };

    case ACTIONS.SET_MESSAGE:
      return { ...state, message: action.payload };

    case ACTIONS.CLEAR_MESSAGE:
      return { ...state, message: "" };

    default:
      return state;
  }
}

// ------------- Context Setup ---------------------
const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

// ------------- Provider Component ----------------
export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

// ------------- Custom Hooks ----------------------

// Read-only access to global state
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalProvider");
  }
  return context;
}

// Dispatch actions
export function useGlobalDispatch() {
  const context = useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error("useGlobalDispatch must be used within a GlobalProvider");
  }
  return context;
}

// Convenience hook to get both
export function useGlobalReducer() {
  return [useGlobalState(), useGlobalDispatch()];
}
