import PoolHeader from "../PoolHeader/PoolHeader";
import PoolRow from "../PoolRow/PoolRow";
import "./PoolTable.css";

export default function PoolTable({ cards, games }) {
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
  );

  return (
    <table className="pool-table">
      <thead>
        <PoolHeader games={sortedGames} />
      </thead>

      <tbody>
        {cards.map((card) => (
          <PoolRow key={card.entry_code} card={card} games={sortedGames} />
        ))}
      </tbody>
    </table>
  );
}

