import React, { createContext, useContext, useEffect, useState } from "react";

export const THEME_OPTIONS = [
  { value: "basic", label: "Basic (Default)" },
  { value: "monochrome", label: "Monochrome" },
  { value: "ocean", label: "Ocean Blue" },
  { value: "emerald", label: "Emerald Green" },
  { value: "vibrant", label: "Colourful" },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem("colorTheme") || "basic");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    THEME_OPTIONS.forEach((t) => root.classList.remove(`theme-${t.value}`));
    if (colorTheme !== "basic") root.classList.add(`theme-${colorTheme}`);
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);