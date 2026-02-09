import type { Theme, ThemeName } from '../types/theme';

export const THEMES: Record<ThemeName, Theme> = {
  ocean: {
    name: 'ocean',
    label: 'Ocean Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#06b6d4',
      chartColors: ['#3b82f6', '#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    },
  },
  forest: {
    name: 'forest',
    label: 'Forest Green',
    colors: {
      primary: '#10b981',
      secondary: '#14b8a6',
      accent: '#84cc16',
      chartColors: ['#10b981', '#14b8a6', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'],
    },
  },
  royal: {
    name: 'royal',
    label: 'Royal Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#d946ef',
      accent: '#ec4899',
      chartColors: ['#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f59e0b', '#3b82f6', '#10b981'],
    },
  },
};

export const DEFAULT_THEME: ThemeName = 'ocean';
