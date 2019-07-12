export class DateUtils {
  static convertDate(dateString: string): Date {
    // assume format is always YYYY-MM-DD
    const data: string[] = dateString.split('-');
    const year = Number(data[0]);
    const month = Number(data[1]) === 1 ? 1 : Number(data[1]) - 1;
    const day = Number(data[2]);
    return new Date(year, month, day);
  }
}
