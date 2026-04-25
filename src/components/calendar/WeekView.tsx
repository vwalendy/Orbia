import React, { useMemo, useCallback } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from 'date-fns';
import { getCategoryGradient } from '../../utils/colorUtils';
import type { Task, Category } from '../../types';
import './WeekView.css';

const EventBlock = React.memo<{
  task: Task;
  categories: Category[];
  onClick: (id: string, e: React.MouseEvent) => void;
}>(({ task, categories, onClick }) => {
  const start = new Date(task.startDate);
  const end = new Date(task.endDate);
  
  const categoryColors = (task.categoryIds || []).map(id => {
    const c = categories.find(cat => cat.id === id);
    return c ? c.color : null;
  }).filter(c => c !== null) as string[];

  const bgBackground = getCategoryGradient(categoryColors);
  
  const top = (start.getHours() + start.getMinutes() / 60) * 48; // 48px per hour
  const height = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 48;

  return (
    <div 
      className="event-block"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        background: bgBackground,
      }}
      onClick={(e) => onClick(task.id, e)}
    >
      <div className="event-title">{task.title}</div>
      <div className="event-time">{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</div>
    </div>
  );
});

export function WeekView() {
  const { currentDate, tasks, categories, hiddenCategoryIds, dispatch } = useCalendar();

  const handleTaskClick = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'OPEN_TASK_MODAL', payload: id });
  }, [dispatch]);

  const { days, hours } = useMemo(() => {
    const startDate = startOfWeek(currentDate);
    const endDate = endOfWeek(currentDate);
    return {
      days: eachDayOfInterval({ start: startDate, end: endDate }),
      hours: Array.from({ length: 24 }, (_, i) => i)
    };
  }, [currentDate]);

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
    <div className="week-view">
      <div className="week-header">
        <div className="time-col-header"></div>
        {days.map(day => {
          const isTod = isToday(day);
          return (
            <div className={`day-col-header ${isTod ? 'today' : ''}`} key={day.toString()}>
              <span className="day-name">{format(day, 'EEE')}</span>
              <span className="day-date">
                <span className={isTod ? 'today-circle' : ''}>{format(day, 'd')}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="week-body scrollable-body">
        <div className="week-grid">
          <div className="time-col">
            {hours.map(hour => (
              <div className="time-slot-label" key={hour}>
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          {days.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDate.get(dateKey) || [];

            return (
              <div className="day-col" key={dateKey}>
                {hours.map(hour => (
                  <div className="time-slot" key={hour}></div>
                ))}
                
                {dayTasks.map(task => (
                  <EventBlock 
                    key={task.id} 
                    task={task} 
                    categories={categories} 
                    onClick={handleTaskClick} 
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
