import { useState, useEffect, type ReactNode } from 'react';
import type { ThemeName, ThemeContextValue } from '../types/theme';
import { ThemeContext } from './ThemeContext';
import { getTheme, setTheme } from '../services/storage';
import { THEMES } from '../constants';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => getTheme());

  const applyTheme = (themeName: ThemeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleSetTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    setTheme(themeName);
    applyTheme(themeName);
  };

  const value: ThemeContextValue = {
    currentTheme,
    theme: THEMES[currentTheme],
    setTheme: handleSetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
