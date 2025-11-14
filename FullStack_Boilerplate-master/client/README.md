Fullstack Boilerplate — React + Vite + Node.js

This is a minimal fullstack boilerplate to quickly start a project with:

Frontend: React with Vite, React Router, Redux Toolkit, Axios

Backend: Node.js + Express, CORS, dotenv, JSON-based persistence

Concurrent development: Run frontend and backend together with npm run dev

Frontend

Built with React + Vite for fast hot module reloading (HMR).

State management handled via Redux Toolkit.

Axios is used for API requests to the backend.

React Router handles client-side routing between pages like / (Home) and /about.

React Compiler

Not enabled in this template for faster dev/build performance.

To enable, see: React Compiler Installation
.

Backend

Built with Node.js + Express.

CORS allows frontend to make requests to backend during development.

dotenv loads environment variables, like PORT.

Simple JSON-based persistence using data/db.json for prototyping small applications.

API Example
GET /api/message
POST /api/message


The frontend calls /api/message to get or update the message stored in db.json.

Frontend & Backend Interaction

Frontend calls backend endpoints using Axios (api.js).

Backend reads/writes data from db.json (or any other storage).

Redux stores the frontend state and can update UI immediately.

Example flow:

User clicks "Change Message" button → Redux dispatch → Axios POST to /api/message → db.json updated → Redux fetches new message → UI updates

Folder Structure

FullStack_BP/
├── client/               # React frontend
│   ├── public/           # Static assets (favicon, index.html, robots.txt)
│   ├── src/              # React source code
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page-level components (Home.jsx, About.jsx)
│   │   ├── store/        # Redux slices and store configuration
│   │   ├── utils/        # Helper functions (e.g., capitalize)
│   │   ├── api.js        # Axios instance & API calls
│   │   ├── App.jsx       # App root with router
│   │   └── main.jsx      # Entry point
│   └── .env              # Frontend environment variables (e.g., VITE_API_URL)
│
├── server/               # Node.js backend
│   ├── routes/           # Express routers (e.g., api.js)
│   ├── data/             # JSON data storage (db.json)
│   └── server.js         # Backend entry point
│
├── package.json           # Root scripts (runs frontend & backend concurrently)
└── README.md              # This file

Folder explanations

client/public/ — Static files served as-is. Anything in public is available at / in the browser.

client/src/ — Main source code, compiled by Vite.

server/data/ — Stores db.json which acts as a simple backend database for prototyping.

assets/ (optional) — Place images, icons, or other media for the frontend.

Development Scripts
Command	What it does
npm run dev	Starts both frontend and backend concurrently
npm run start:server	Starts backend only
npm run start:client	Starts frontend only
Expanding ESLint / TypeScript

ESLint is preconfigured for React.

For production projects, consider using TypeScript with typescript-eslint for type-aware linting:
React + TypeScript Template

Notes

Environment Variables:

Frontend: VITE_API_URL points to backend API URL.

Backend: .env can set PORT and other server configs.

Concurrent Dev:

Uses concurrently package at root to run both frontend (Vite) and backend (Express) in one terminal.

Production:

Replace JSON persistence with a real database (MongoDB, PostgreSQL, etc.)

Build frontend with npm run build and serve static files via Express or a dedicated web server.




----------------------------------------------------------


# React + Vite 

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules. 

Currently, two official plugins are available: 

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh 
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh 

## React Compiler 

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation). 

## Expanding the ESLint configuration 

In the ReadMe file could you also include a description on how the frontend and backend work together as well an explaintion on what teh Assets, public and data folders hold and anythign else you think needs explaining. 

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [typescript-eslint](https://typescript-eslint.io) in your project.