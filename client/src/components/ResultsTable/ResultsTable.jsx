import GameHeaderRow from "../GameHeaderRow/GameHeaderRow";
import ResultsRow from "../ResultsRow/ResultsRow";
import "../ResultsTable/ResultsTable.css";

export default function ResultsTable({ cards, games }) {
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
  );

  return (
    <table className="results-table">
      <thead>
        <GameHeaderRow games={sortedGames} />
      </thead>

      <tbody>
        {cards.map((card) => (
          <ResultsRow key={card.entry_code} card={card} games={sortedGames} />
        ))}
      </tbody>
    </table>
  );
}
