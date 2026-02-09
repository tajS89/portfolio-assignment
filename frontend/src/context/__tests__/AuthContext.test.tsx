import { describe, it, expect } from 'vitest';
import { AuthContext } from '../AuthContext';

describe('AuthContext', () => {
  it('should be defined', () => {
    expect(AuthContext).toBeDefined();
  });

  it('should be a valid React Context', () => {
    expect(AuthContext.Provider).toBeDefined();
    expect(AuthContext.Consumer).toBeDefined();
  });
});
