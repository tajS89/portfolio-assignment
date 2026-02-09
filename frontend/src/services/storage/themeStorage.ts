import type { ThemeName } from '../../types/theme';
import { DEFAULT_THEME } from '../../constants/themes';

const THEME_KEY = 'portfolio_theme';

export const getTheme = (): ThemeName => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'ocean' || stored === 'forest' || stored === 'royal') {
      return stored;
    }
    return DEFAULT_THEME;
  } catch (error) {
    console.error('Failed to get theme:', error);
    return DEFAULT_THEME;
  }
};

export const setTheme = (themeName: ThemeName): void => {
  try {
    localStorage.setItem(THEME_KEY, themeName);
  } catch (error) {
    console.error('Failed to set theme:', error);
  }
};
