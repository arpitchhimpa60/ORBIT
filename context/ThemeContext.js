
import { createContext, useState } from "react";

// Shared theme context
export const ThemeContext = createContext();

// Dark theme
const darkTheme = {
  // Backgrounds
  background: "#302078",
  secondaryBackground: "#211650",
  card: "#40318C",
  surface: "#49399A",
  input: "#211650",

  // Primary colors
  primary: "#7669D8",
  highlight: "#A99EFF",

  // Text colors
  text: "#FFFFFF",
  secondaryText: "#D8D2FF",
  placeholder: "#BDB5E8",

  // Buttons
  button: "#FFFFFF",
  buttonText: "#302078",

  // Borders and separators
  border: "#6258E8",
  divider: "rgba(255,255,255,0.15)",

  // Navigation
  tabBar: "#211650",
  tabActive: "#FFFFFF",
  tabInactive: "#BDB5E8",

  // Orbital decorations
  orbit: "rgba(255,255,255,0.18)",
  star: "#FFFFFF",
  planet: "#7669D8",

  // Status colors
  success: "#65D6A0",
  danger: "#FF7777",
};

// Light theme
const lightTheme = {
  // Backgrounds
  background: "#F4F0FF",
  secondaryBackground: "#E9E2FF",
  card: "#FFFFFF",
  surface: "#F0EBFF",
  input: "#FFFFFF",

  // Primary colors
  primary: "#7669D8",
  highlight: "#5545B8",

  // Text colors
  text: "#211650",
  secondaryText: "#62558C",
  placeholder: "#9589B8",

  // Buttons
  button: "#7669D8",
  buttonText: "#FFFFFF",

  // Borders and separators
  border: "#D1C5FF",
  divider: "#E5DEFA",

  // Navigation
  tabBar: "#FFFFFF",
  tabActive: "#5545B8",
  tabInactive: "#9589B8",

  // Orbital decorations
  orbit: "rgba(118,105,216,0.18)",
  star: "#7669D8",
  planet: "#A99EFF",

  // Status colors
  success: "#218A60",
  danger: "#D94355",
};

// Theme Provider
export default function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("Dark");

  // Select the correct color palette
  const theme = themeName === "Dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setThemeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
