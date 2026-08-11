// src/components/AppLayout.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { navigationItems } from "../../config/navConfig";
import { THEMES } from "../../utils/constants";
import styles from "./AppLayout.module.css";

export default function AppLayout({
  children,
  darkMode,
  onDarkModeToggle,
  theme,
  onThemeChange,
  sidebarOpen,
  onSidebarToggle,
  onSignOut,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 768) {
      if (sidebarOpen) onSidebarToggle();
    }
  }, [location.pathname]);

  return (
    <div className={styles.appContainer}>
      {/* 1. TOP NAVBAR */}
      <header className={styles.navbar}>
        <button className={styles.sidebarToggle} onClick={onSidebarToggle}>
          <i className={`fa-solid fa-${sidebarOpen ? "bars" : "bars"}`}></i>
        </button>
        <div className={styles.logo}>
          Bible<span>Memory</span>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {sidebarOpen && <div className={styles.backdrop} onClick={onSidebarToggle} />}
        {/* 2. SIDEBAR NAVIGATION */}
        {sidebarOpen && (
          <aside
            className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
          >
            <nav className={styles.navMenu}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                // Dynamically combine standard link style with active style if selected
                const buttonClass = `${styles.navLink} ${isActive ? styles.activeNavLink : ""}`;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={buttonClass}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className={styles.sidebarFooter}>
              {/* Theme picker */}
              <div className={styles.themeRow}>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    className={`${styles.themeDot} ${theme.id === t.id ? styles.themeDotActive : ""}`}
                    style={{ backgroundColor: t.color }}
                    onClick={() => onThemeChange(t)}
                    title={t.id}
                  />
                ))}
              </div>

              {/* Dark mode toggle */}
              <button className={styles.darkModeRow} onClick={onDarkModeToggle}>
                <i className={`fa-solid.fa-${darkMode ? "moon" : "sun"}`}></i>
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>

              {/* Sign out */}
              <button className={styles.signOutBtn} onClick={onSignOut}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        )}

        {/* 3. DYNAMIC CONTENT AREA */}
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
