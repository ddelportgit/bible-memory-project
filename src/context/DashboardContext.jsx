import { createContext, useContext, useState, useEffect } from "react";
import { loadProgress } from "../utils/memoryGridUtils";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const progressData = await loadProgress();
      setProgress(progressData);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        progress,
        setProgress,
        loading,
        setLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
