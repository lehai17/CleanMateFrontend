import { useLocation } from "react-router-dom";
import AppRoutes from "./app/AppRoutes";

export default function App() {
  const location = useLocation();
  const shouldHideChrome = ["/admin", "/login", "/register"].some((p) =>
    location.pathname.startsWith(p)
  );

  return <AppRoutes shouldHideChrome={shouldHideChrome} />;
}
