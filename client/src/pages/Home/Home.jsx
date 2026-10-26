
import { useSports } from "../../hooks/useSports";
import SportsCard from "../../components/SportsCard/SportsCard";
import "../Home/Home.css";

export default function Home() {
  const {
    store: { sports, oddsBySport },
    loading,
    error,
  } = useSports();

  return (
    <div className="home-container">
      <h1 className="main-title">
        Welcome to Mando's Sports Book
      </h1>

      {loading && <p>Loading sports and odds...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="sports-card-container">
        {sports.map((sport) => (
          <SportsCard
            key={sport.key}
            sport={sport}
            games={oddsBySport[sport.key] ?? []}
          />
        ))}
      </div>
    </div>
  );
}
