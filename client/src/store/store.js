// Import Redux Toolkit's store configuration helper
import { configureStore } from "@reduxjs/toolkit";
// Import the slice reducer you created
import exampleReducer from "./exampleSlice";

// Create and export the Redux store
export const store = configureStore({
  // Combine all slice reducers under their slice names
  reducer: {
    example: exampleReducer, // This manages state.example in the global store
  },
});

/*
🧠 Quick summary:
- `configureStore` simplifies setting up Redux — no need to manually combine reducers or add middleware.
- The `example` key becomes part of your global Redux state (i.e., state.example).
- This store should be provided to your entire React app (typically in main.jsx) using the <Provider> component.
- You can later add more slices here (e.g., user, posts, auth) by extending the `reducer` object.

✅ Example structure in global state:
{
  example: {
    message: "Hello from Redux"
  }
}
*/
