import { useEffect, useState } from "react";
import { fetchDashboard, login } from "../services/apiClient";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      await login("owner");
      const dashboard = await fetchDashboard();
      setData(dashboard);
      setLoading(false);
    }
    bootstrap();
  }, []);

  return { data, loading };
}
