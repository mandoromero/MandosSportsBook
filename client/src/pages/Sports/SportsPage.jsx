import { useParams } from "react-router-dom";

export default function SportPage() {
  const { sportKey } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>{sportKey}</h1>
      <p>
        Sport page is working.
      </p>
    </div>
  );
}

