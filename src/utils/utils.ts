export function getDateMonthYear(date: Date): string {
  try {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    console.log(e);
    return "N/A";
  }
}
