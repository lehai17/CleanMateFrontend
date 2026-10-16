import { Ui, Raw } from './../ui/Preferences';
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Cleaners() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [cleaners, setCleaners] = useState([]);

  useEffect(() => {
    api.get("/cleaners").then((res) => setCleaners(res.data));
  }, []);

  return (
    <Ui as="div">
      <Ui as="h2">Cleaners</Ui>
      <Ui as="ul">
        {cleaners.map((c) => (
          <Ui as="li" key={c.id}>
            {<Raw>{c.name}</Raw>} - {c.city} - {c.hourlyRate} VND/h
          </Ui>
        ))}
      </Ui>
    </Ui>
  );
}
