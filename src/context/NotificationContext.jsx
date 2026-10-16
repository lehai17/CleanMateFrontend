import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getUnreadCount } from "../api/notifications";

const Context = createContext({ unreadCount: null, refresh: () => {} });

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState({ userId: null, count: null });
  const [revision, setRevision] = useState(0);
  const userId = user?.id;
  const { pathname } = useLocation();
  const refresh = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    if (!userId) return;
    let active = true, pending = false;
    const load = async () => {
      if (pending || document.visibilityState === "hidden") return;
      pending = true;
      try {
        const result = await getUnreadCount();
        if (active) setState({ userId, count: result.unreadCount });
      } catch { /* Keep the last known count; the inbox exposes load failures. */ }
      finally { pending = false; }
    };
    load();
    const timer = setInterval(load, 30000);
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", load);
    return () => {
      active = false; clearInterval(timer);
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", load);
    };
  }, [userId, revision, pathname]);
  return <Context.Provider value={{ unreadCount: state.userId === userId ? state.count : null,
    refresh }}>{children}</Context.Provider>;
}

export const useNotifications = () => useContext(Context);
