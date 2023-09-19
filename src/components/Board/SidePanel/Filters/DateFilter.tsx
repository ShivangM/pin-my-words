import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker';
import useBoardStore from '@/store/boardStore';
import useUserStore from '@/store/userStore';

const DateFilter = () => {
  const [createdAt, selectedDate, filterByDate] = useBoardStore((state) => [
    state.board?.createdAt,
    state.selectedDate,
    state.filterByDate,
  ]);

  const [userData] = useUserStore((state) => [state.userData]);

  const today = new Date();

  return (
    <Calendar
      value={selectedDate}
      onChange={(date) => filterByDate(date, userData?.uid!, 10)}
      shouldHighlightWeekends
      minimumDate={{
        year: createdAt?.toDate().getFullYear()!,
        month: createdAt?.toDate().getMonth()! + 1,
        day: createdAt?.toDate().getDate()!,
      }}
      maximumDate={{
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      }}
      calendarClassName="!w-full"
    />
  );
};

export default DateFilter;
