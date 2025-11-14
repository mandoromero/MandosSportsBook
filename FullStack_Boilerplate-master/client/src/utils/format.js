// Capitalizes the first letter of a string
export const capitalize = (str) => 
  str.charAt(0).toUpperCase() + str.slice(1);

/*
🧠 Quick summary:
- Takes a string `str` (e.g., "hello").
- `charAt(0)` grabs the first character → "h".
- `.toUpperCase()` converts it → "H".
- `str.slice(1)` gets the rest of the string → "ello".
- Concatenates them into → "Hello".
- Useful for formatting UI text, like names or titles.

✅ Example:
capitalize("redux") ➜ "Redux"
*/
