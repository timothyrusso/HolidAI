import { formatDateForPrompt } from '@/features/core/dates/domain/utils/formatDateForPrompt';
import {
  getTimezoneFormattedDate,
  getTodayInLocalTimezone,
} from '@/features/core/dates/domain/utils/getTimezoneFormattedDate';

const CALENDAR_PICK = new Date(2026, 4, 12, 9, 30);

describe('formatDateForPrompt', () => {
  it('writes the ISO date of a date', () => {
    expect(formatDateForPrompt(new Date('2026-03-01T00:00:00Z'))).toBe('2026-03-01');
  });

  it('writes nothing for no date', () => {
    expect(formatDateForPrompt(null)).toBe('');
  });
});

describe('getTimezoneFormattedDate', () => {
  it('shifts a date so its UTC fields read as the local date and time', () => {
    const shifted = getTimezoneFormattedDate(CALENDAR_PICK);

    expect([shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate(), shifted.getUTCHours()]).toEqual([
      2026, 4, 12, 9,
    ]);
  });
});

describe('getTodayInLocalTimezone', () => {
  it('shifts now like a picked date', () => {
    expect(getTodayInLocalTimezone(CALENDAR_PICK)).toEqual(getTimezoneFormattedDate(CALENDAR_PICK));
  });
});
