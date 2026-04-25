import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import './Calendar.css';

export function Calendar() {
  const { viewType } = useCalendar();

  return (
    <div className="calendar-container">
      {viewType === 'month' && <MonthView />}
      {viewType === 'week' && <WeekView />}
      {viewType === 'day' && <DayView />}
    </div>
  );
}
