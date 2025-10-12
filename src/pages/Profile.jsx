import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [me, setMe] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    api
      .get("/me")
      .then((res) => setMe(res.data))
      .catch(() => setMe(null));
  }, []);

  if (!me) return <p>Please login</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  );
}
