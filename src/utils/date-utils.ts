export class DateUtils {
  static convertDate(dateString: string): Date {
    // assume format is always YYYY-MM-DD
    const data: string[] = dateString.split('-');
    const year = Number(data[0]);
    const month = Number(data[1]) === 1 ? 1 : Number(data[1]) - 1;
    const day = Number(data[2]);
    return new Date(year, month, day);
  }

  static getDays(input: Date): number {
    const today = new Date();
    const date = input.getDate() < 10 ? '0' + input.getDate() : input.getDate();
    const month = input.getMonth() + 1 < 10 ? '0' + (input.getMonth() + 1) : input.getMonth() + 1;
    const year = input.getMonth() < today.getMonth() ? today.getFullYear() + 1 : today.getFullYear();
    input = DateUtils.convertDate(`${year}-${month}-${date}`);

    const timeDiff = Math.abs(input.getTime() - today.getTime());
    const dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDifference;
  }
}
