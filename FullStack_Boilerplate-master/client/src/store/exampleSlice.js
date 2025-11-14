// Import Redux Toolkit's createSlice helper
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for this slice of the store
const initialState = {
  message: "Hello from Redux", // default message shown when the app loads
};

// Create the slice — a bundle of state + reducers + actions
const exampleSlice = createSlice({
  name: "example", // the name of this slice (used in action types and the store)
  initialState,
  reducers: {
    // Reducer function: defines *how* the state changes
    setMessage: (state, action) => {
      // Redux Toolkit uses Immer under the hood, so you can safely mutate state directly
      state.message = action.payload;
    },
  },
});

// Export the generated action so components can dispatch it
export const { setMessage } = exampleSlice.actions;

// Export the reducer so it can be included in the Redux store
export default exampleSlice.reducer;

/*
🧠 Quick summary:
- This file defines the "example" slice of your Redux store.
- It starts with an initial message and can update that message via `setMessage`.
- Redux Toolkit automatically creates the action and action type for you.
- This keeps your code concise and avoids writing boilerplate.

✅ Example usage in a component:
const message = useSelector((state) => state.example.message);
const dispatch = useDispatch();

<button onClick={() => dispatch(setMessage("New text!"))}>
  Change Message
</button>;
*/
