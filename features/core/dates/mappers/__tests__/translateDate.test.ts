import { translateDate } from '@/features/core/dates/mappers/translateDate';

describe('translateDate', () => {
  it('writes a date the way the locale does', () => {
    expect(translateDate('it-IT', new Date(2026, 10, 11))).toBe('11/11/2026');
  });

  it('reads an ISO date string', () => {
    expect(translateDate('en-US', '2026-05-12')).toBe('5/12/2026');
  });

  it('reads a day-first date string', () => {
    expect(translateDate('it-IT', '25/12/2026')).toBe('25/12/2026');
  });

  it('reads a year-first slash date string as year, month, day', () => {
    expect(translateDate('en-US', '2026/05/12')).toBe('5/12/2026');
  });

  it('writes nothing for an invalid Date', () => {
    expect(translateDate('en-US', new Date('not a date'))).toBe('');
  });

  it('writes nothing for a string in no known format', () => {
    expect(translateDate('en-US', 'next tuesday')).toBe('');
  });

  it('writes nothing for no date', () => {
    expect(translateDate('en-US', undefined)).toBe('');
  });
});
