'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeContextValue {
  theme: Theme;
  colorMode: ColorMode;
  setTheme: (theme: Theme) => void;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = 'taskflow-theme';
const COLOR_MODE_KEY = 'taskflow-color-mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('amber');

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const storedColorMode = localStorage.getItem(COLOR_MODE_KEY) as ColorMode | null;
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setThemeState(storedTheme);
    }
    if (
      storedColorMode === 'amber' ||
      storedColorMode === 'blue' ||
      storedColorMode === 'pink' ||
      storedColorMode === 'rose' ||
      storedColorMode === 'emerald' ||
      storedColorMode === 'black'
    ) {
      setColorModeState(storedColorMode);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-color-mode', colorMode);
  }, [theme, colorMode]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(THEME_KEY, next);
  }, []);

  const setColorMode = useCallback((next: ColorMode) => {
    setColorModeState(next);
    localStorage.setItem(COLOR_MODE_KEY, next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}