import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isSameDay } from 'date-fns';
import './MonthView.css';

export function MonthView() {
  const { currentDate, tasks, categories, hiddenCategoryIds, dispatch } = useCalendar();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="month-view">
      <div className="days-header">
        {weekDays.map(day => (
          <div className="day-name" key={day}>{day}</div>
        ))}
      </div>
      <div className="days-grid">
        {days.map((day, i) => {
          const isSameM = isSameMonth(day, monthStart);
          const isTod = isToday(day);

          // Get tasks for this day
          const dayTasks = tasks.filter(task => {
            const taskDate = new Date(task.startDate);
            return isSameDay(taskDate, day) && (!task.categoryId || !hiddenCategoryIds.has(task.categoryId));
          });

          return (
            <div 
              className={`day-cell ${!isSameM ? 'disabled' : ''} ${isTod ? 'today' : ''}`} 
              key={day.toString()}
            >
              <div className="date-number">
                <span className={isTod ? 'today-circle' : ''}>{format(day, 'd')}</span>
              </div>
              <div className="event-list">
                {dayTasks.map(task => {
                  const category = categories.find(c => c.id === task.categoryId);
                  const color = category ? category.color : 'var(--brand-primary)';
                  return (
                    <div 
                      key={task.id} 
                      className="event-badge" 
                      style={{ backgroundColor: color }}
                      onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_TASK_MODAL', payload: task.id }); }}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
