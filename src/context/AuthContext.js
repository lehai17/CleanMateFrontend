import React, { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "../api/auth"; // gọi API để check token

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cm_token");
    if (token) {
      meApi()
        .then((u) => {
          setUser(u);
          localStorage.setItem("cm_user", JSON.stringify(u));
        })
        .catch(() => {
          // token hết hạn
          localStorage.removeItem("cm_user");
          localStorage.removeItem("cm_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("cm_user", JSON.stringify(user));
    localStorage.setItem("cm_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("cm_user");
    localStorage.removeItem("cm_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
