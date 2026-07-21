// src/config/navConfig.js
import { Grid, Layers, LayoutDashboard, Settings as SettingsIcon } from "lucide-react";

export const navigationItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Bible Memory Grid", path: "/memory-grid", icon: Grid },
  { name: "Bible Flash Cards", path: "/flash-cards", icon: Layers },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];
