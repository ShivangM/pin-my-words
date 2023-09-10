import { useState } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import {
  Calendar,
  DayValue,
} from '@hassanmojab/react-modern-calendar-datepicker';
import useBoardStore from '@/store/boardStore';

const DateFilter = () => {
  const [selectedDay, setSelectedDay] = useState<DayValue>(null);
  const [createdAt] = useBoardStore((state) => [state.board?.createdAt]);

  const today = new Date();

  return (
    <Calendar
      value={selectedDay}
      onChange={(date) => setSelectedDay(date)}
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
    />
  );
};

export default DateFilter;
