export type ThemeName = 'ocean' | 'forest' | 'royal';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  chartColors: readonly string[];
}

export interface Theme {
  name: ThemeName;
  label: string;
  colors: ThemeColors;
}

export interface ThemeContextValue {
  currentTheme: ThemeName;
  theme: Theme;
  setTheme: (themeName: ThemeName) => void;
}
