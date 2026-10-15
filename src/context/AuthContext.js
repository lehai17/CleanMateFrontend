import React, { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cm_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cm_token");
    if (!token) {
      setLoading(false);
      return;
    }

    meApi()
      .then((currentUser) => {
        setUser(currentUser);
        localStorage.setItem("cm_user", JSON.stringify(currentUser));
      })
      .catch(() => {
        localStorage.removeItem("cm_user");
        localStorage.removeItem("cm_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (currentUser, token) => {
    localStorage.setItem("cm_token", token);
    localStorage.setItem("cm_user", JSON.stringify(currentUser));
    setUser(currentUser);
  };

  const refreshUser = (currentUser) => {
    localStorage.setItem("cm_user", JSON.stringify(currentUser));
    setUser(currentUser);
  };

  const logout = () => {
    localStorage.removeItem("cm_user");
    localStorage.removeItem("cm_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: localStorage.getItem("cm_token"),
        login,
        refreshUser,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
