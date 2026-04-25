import React, { useMemo, useCallback } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';
import { getCategoryGradient } from '../../utils/colorUtils';
import type { Task, Category } from '../../types';
import './MonthView.css';

// Memoized cell component to prevent unnecessary re-renders on global state changes
const DayCell = React.memo<{
  day: Date;
  monthStart: Date;
  dayTasks: Task[];
  categories: Category[];
  onTaskClick: (id: string, e: React.MouseEvent) => void;
}>(({ day, monthStart, dayTasks, categories, onTaskClick }) => {
  const isSameM = isSameMonth(day, monthStart);
  const isTod = isToday(day);

  return (
    <div className={`day-cell ${!isSameM ? 'disabled' : ''} ${isTod ? 'today' : ''}`}>
      <div className="date-number">
        <span className={isTod ? 'today-circle' : ''}>{format(day, 'd')}</span>
      </div>
      <div className="event-list">
        {dayTasks.map(task => {
          const categoryColors = (task.categoryIds || []).map(id => {
            const c = categories.find(cat => cat.id === id);
            return c ? c.color : null;
          }).filter(c => c !== null) as string[];

          const bgBackground = getCategoryGradient(categoryColors);

          return (
            <div 
              key={task.id} 
              className="event-badge" 
              style={{ background: bgBackground }}
              onClick={(e) => onTaskClick(task.id, e)}
            >
              {task.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}, (prev, next) => {
  // Custom equality check: only re-render if tasks array reference changed or day/monthStart changed
  return prev.day.getTime() === next.day.getTime() 
      && prev.monthStart.getTime() === next.monthStart.getTime()
      && prev.dayTasks === next.dayTasks
      && prev.categories === next.categories; // Simplest check, works well enough for static category state
});

export function MonthView() {
  const { currentDate, tasks, categories, hiddenCategoryIds, dispatch } = useCalendar();

  const handleTaskClick = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'OPEN_TASK_MODAL', payload: id });
  }, [dispatch]);

  const { monthStart, days, weekDays } = useMemo(() => {
    const mStart = startOfMonth(currentDate);
    const mEnd = endOfMonth(mStart);
    const sDate = startOfWeek(mStart);
    const eDate = endOfWeek(mEnd);
    return {
      monthStart: mStart,
      days: eachDayOfInterval({ start: sDate, end: eDate }),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };
  }, [currentDate]);

  // Pre-calculate tasks mapped to days to avoid O(N*Days) loops during render
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(t => {
      const cats = t.categoryIds || [];
      const visible = cats.length === 0 || cats.some(catId => !hiddenCategoryIds.has(catId));
      if (!visible) return;

      const dateKey = format(new Date(t.startDate), 'yyyy-MM-dd');
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(t);
    });
    return map;
  }, [tasks, hiddenCategoryIds]);

  return (
    <div className="month-view">
      <div className="days-header">
        {weekDays.map(day => (
          <div className="day-name" key={day}>{day}</div>
        ))}
      </div>
      <div className="days-grid">
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate.get(dateKey) || [];
          return (
            <DayCell 
              key={dateKey}
              day={day}
              monthStart={monthStart}
              dayTasks={dayTasks}
              categories={categories}
              onTaskClick={handleTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
}
