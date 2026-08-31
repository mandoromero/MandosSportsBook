import useGames from "../../hooks/useGames";
import ResultsTable from "../../components/ResultsTable/ResultsTable";
import "../NFLPoolResults/NFLPoolResults.css";

export default function NFLPoolResults({ token }) {
  const { games, loading } = useGames(token);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch("http://localhost:5001/api/admin/picks/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setCards(data);
    };

    fetchResults();
  }, [token]);

  if (loading) return <p>Loading games...</p>;

  return <ResultsTable cards={cards} games={games} />;
}
