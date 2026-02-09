import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { THEMES } from '../../constants/themes';
import type { ThemeName } from '../../types/theme';

export function ThemeToggle() {
  const { currentTheme, setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleThemeChange = (themeName: ThemeName) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block z-50">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-0.5 sm:gap-2 px-1.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0 rounded hover:bg-gray-100"
        title="Change theme"
        aria-label="Change theme"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div
          className="w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: theme.colors.primary }}
          aria-hidden="true"
        />
        <span className="hidden xs:inline text-xs sm:text-sm font-medium">{theme.label}</span>
        <svg
          className={`w-2.5 h-2.5 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute -right-2 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          role="menu"
          onKeyDown={handleKeyDown}
        >
          {(Object.entries(THEMES) as [ThemeName, typeof THEMES[ThemeName]][]).map(
            ([themeName, themeConfig]) => (
              <button
                key={themeName}
                onClick={() => handleThemeChange(themeName)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between gap-2 transition-colors first:rounded-t-lg last:rounded-b-lg"
                role="menuitem"
                aria-current={currentTheme === themeName ? 'true' : 'false'}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: themeConfig.colors.primary }}
                  />
                  <span className="text-sm text-gray-700 truncate">{themeConfig.label}</span>
                </div>
                {currentTheme === themeName && (
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
