// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./utils/supabase.js";
import { THEMES } from "./utils/constants";
import AppLayout from "./components/AppLayout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import BibleMemoryGrid from "./features/memoryGrid/BibleMemoryGrid";
import BibleFlashCards from "./features/flashCards/BibleFlashCards";
import Auth from "./features/auth/Auth";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import LandingPage from "./pages/LandingPage/LandingPage";
import GuestMemoryGrid from "./features/guest/GuestMemoryGrid";
import { MemoryGridProvider } from "./context/MemoryGridContext";
import { FlashCardProvider } from "./context/FlashCardContext";
import { DashboardProvider } from "./context/DashboardContext";
import { ToastProvider } from "./context/ToastContext";
import Settings from "./pages/Settings/Settings";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? JSON.parse(saved) : THEMES[0];
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.body.style.setProperty("--theme", theme.color);
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  if (loading) return <LoadingScreen />;

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <ToastProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/sign-in" element={session ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/guest" element={<GuestMemoryGrid />} />

        {/* Protected routes */}
        {session ? (
          <Route
            path="/*"
            element={
              <MemoryGridProvider>
                <FlashCardProvider>
                  <DashboardProvider>
                    <AppLayout
                      darkMode={darkMode}
                      onDarkModeToggle={() => setDarkMode(!darkMode)}
                      theme={theme}
                      onThemeChange={setTheme}
                      sidebarOpen={sidebarOpen}
                      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                      onSignOut={handleSignOut}
                    >
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/memory-grid" element={<BibleMemoryGrid />} />
                        <Route path="/flash-cards" element={<BibleFlashCards />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                      </Routes>
                    </AppLayout>
                  </DashboardProvider>
                </FlashCardProvider>
              </MemoryGridProvider>
            }
          />
        ) : (
          <Route path="/*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </ToastProvider>
  );
}
