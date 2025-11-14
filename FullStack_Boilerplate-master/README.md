# FullStack Boilerplate (React + Express)

## Overview

This repository is a **full-stack boilerplate** for quickly building React + Express applications. It includes:  

- **Frontend:** React with Vite, React Router for page navigation.  
- **Backend:** Express server with a minimal API setup, using a JSON file (`db.json`) as a lightweight data store.  
- **Full-stack integration:** Frontend fetch requests are proxied to the backend API for seamless development.  

The boilerplate includes a simple example: a **Message Board** that demonstrates:  
- Fetching data from the backend (`GET /api/message`)  
- Updating data on the backend (`POST /api/message`)  
- State management in React with `useState` and `useEffect`  
- Preventing page refresh on form submissions  

---

## Folder Structure

FullStack_Boilerplate/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ │ └── MessageBoard.jsx
│ │ ├── pages/ # Page components (Home, About)
│ │ └── App.jsx
│ └── vite.config.js
├── server/ # Express backend
│ ├── data/
│ │ └── db.json # JSON file used as a simple database
│ ├── routes/
│ │ └── api.js # API routes
│ └── server.js # Main server entry
├── package.json
└── README.md


---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd FullStack_Boilerplate

### 2. Install dependencies**

# Install backend dependencies
npm install

# Install frontend dependencies
npm install --prefix client

### 3. Start the development servers

npm run dev




