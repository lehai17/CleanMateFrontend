import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Cleaners() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [cleaners, setCleaners] = useState([]);

  useEffect(() => {
    api.get("/cleaners").then((res) => setCleaners(res.data));
  }, []);

  return (
    <div>
      <h2>Cleaners</h2>
      <ul>
        {cleaners.map((c) => (
          <li key={c.id}>
            {c.name} - {c.city} - {c.hourlyRate} VND/h
          </li>
        ))}
      </ul>
    </div>
  );
}
