import { createContext, useContext, useState } from "react";

const DashboardContext = createContext({
  dashboardData: null,
  setDashboardData: () => {},
});

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(null);

  return (
    <DashboardContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
