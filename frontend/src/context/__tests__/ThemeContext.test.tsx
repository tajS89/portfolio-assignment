import { describe, it, expect } from 'vitest';
import { ThemeContext } from '../ThemeContext';

describe('ThemeContext', () => {
  it('should be defined', () => {
    expect(ThemeContext).toBeDefined();
  });

  it('should be a valid React Context', () => {
    expect(ThemeContext.Provider).toBeDefined();
    expect(ThemeContext.Consumer).toBeDefined();
  });
});
