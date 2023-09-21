import { DayValue } from 'react-modern-calendar-datepicker';

const convertDayValueToDate = (dayValue: DayValue): Date | undefined => {
  if (!dayValue) return;
  const year = dayValue.year;
  const month = dayValue.month;
  const day = dayValue.day;
  const date = new Date(year, month - 1, day);
  return date;
};

export default convertDayValueToDate;
