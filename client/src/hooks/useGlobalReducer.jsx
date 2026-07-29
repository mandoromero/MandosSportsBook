import {
  createContext,
  useContext,
  useReducer,
} from "react";

/* =========================
   LOCAL STORAGE
========================= */
const storedUser =
  localStorage.getItem("user");

const storedToken =
  localStorage.getItem("token");

let parsedUser = null;

try {
  parsedUser = storedUser
    ? JSON.parse(storedUser)
    : null;
} catch {
  localStorage.removeItem("user");
}

/* =========================
   INITIAL STATE
========================= */
const initialState = {
  /* AUTH */
  user: parsedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,

  /* SPORTS */
  sports: [],

  /* NFL */
  nflGamers: [],
  selectedTeam: {},
  totalPoints: "",
  currentWeek: 1,
  entryCode: "",

  /* UI */
  loading: false,
  error: null,
};

/* =========================
   ACTION TYPES
========================= */
export const ACTIONS = {
  /* AUTH */
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",

  /* SPORTS */
  SET_SPORTS: "SET_SPORTS",

  /* NFL */
  SET_NFL_GAMES: "SET_NFL_GAMES",
  SET_SELECTED_TEAM: "SET_SELECTED_TEAM",
  SET_TOTAL_POINTS: "SET_TOTAL_POINTS",
  SET_ENTRY_CODE: "SET_ENTRY_CODE",
  SET_WEEK: "SET_WEEK",

  /* UI */
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

/* =========================
   REDUCER
========================= */
const reducer = (state, action) => {
  switch (action.type) {
    /* =====================
       LOGIN / REGISTER
    ===================== */
    case ACTIONS.SET_USER:
      localStorage.setItem(
        "token",
        action.payload.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          action.payload.user
        )
      );

      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };

    /* =====================
       LOGOUT
    ===================== */
    case ACTIONS.LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        sports: [],
        error: null,
      };

    /* =====================
       SPORTS DATA
    ===================== */
    case ACTIONS.SET_SPORTS:
      return {
        ...state,
        sports: action.payload,
        loading: false,
        error: null,
      };

    /* =====================
       LOADING
    ===================== */
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null,
      };

    /* =====================
       ERROR
    ===================== */
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    /* ====================
        NFL GAMES
      ===================*/
    case ACTIONS.SET_NFL_GAMES:
      return {
        ...state,
        nflGames: action.payload,
      };

    /*====================
        SELECTED TEAMS
    ===================*/
    case ACTION.SET_SELECTED_TEAM:
      return {
        ...state,
        selectedTeam: action.payload,
      };
    
    /*====================
        MONDAY TOTAL
    ===================*/
    case ACTION.SET_TOTAL_POINTS:
      return {
        ...state,
        totalPoints: action.payload,
      };

    /*================
        ENTRY CODE
      ==============*/
    case ACTION.SET.ENTRY.CODE:
      return {
        ...state,
        entryCode: action.payload,
      };

    /*================
        CURRENT WEEK
      ==============*/
    case ACTION.CURRENT_WEEK:
      return {
        ...state,
        currentWeek: action.payload,
      }

    /* =====================
       DEFAULT
    ===================== */
    default:
      return state;
  }
};

/* =========================
   CONTEXT
========================= */
const StoreContext =
  createContext();

/* =========================
   PROVIDER
========================= */
export const StoreProvider = ({
  children,
}) => {
  const [store, dispatch] =
    useReducer(
      reducer,
      initialState
    );

  return (
    <StoreContext.Provider
      value={{
        store,
        dispatch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

/* =========================
   CUSTOM HOOK
========================= */
export const useGlobalReducer =
  () => {
    const context =
      useContext(StoreContext);

    if (!context) {
      throw new Error(
        "useGlobalReducer must be used inside StoreProvider"
      );
    }

    return context;
  };