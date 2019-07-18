import { DateUtils } from './date-utils';

describe('DateUtils', () => {
  it('should convert string date into date', () => {
    const date: Date = DateUtils.convertDate('1992-10-03');
    expect(date.toDateString()).toBe('Sat Oct 03 1992');
  });

  it('should return 0 of days difference', () => {
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const days = DateUtils.getDays(today);
    expect(days).toBe(0);
  });
});
