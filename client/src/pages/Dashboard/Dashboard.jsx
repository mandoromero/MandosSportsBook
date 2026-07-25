import React from "react";
import { useEffect, useState } from "react";
import SportsCard from "../../components/SportsCard/SportsCard";
import "../Dashboard/Dashboard.css";

export default function Dashboard() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/sports/games")
      .then((res) => {
        console.log(res.data);
        setGames(res.data.response);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div id="dashboard-container">
      <h1 className="dashboard-title">Welcome to Mando's Sports Book!</h1>
      <div className="sport-card-container">
        <SportsCard  
          title="Baseball"
          sport="baseball"
          imagae="/images/baseball.jpg"
        />
        <SportsCard  
          title="Basketball"
          sport="basketball"
          imagae="/images/basketball.jpg"
        />
        <SportsCard  
          title="Hockey"
          sport="hockey"
          imagae="/images/hockey.jpg"
        />
      </div>
    </div>
  )
}