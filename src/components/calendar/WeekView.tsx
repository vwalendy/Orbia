import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, isSameDay } from 'date-fns';
import './WeekView.css';

export function WeekView() {
  const { currentDate, tasks, categories, hiddenCategoryIds, dispatch } = useCalendar();

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

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
          {days.map(day => (
            <div className="day-col" key={day.toString()}>
              {hours.map(hour => (
                <div className="time-slot" key={hour}>
                </div>
              ))}
              
              {tasks.filter(t => isSameDay(new Date(t.startDate), day) && (!t.categoryId || !hiddenCategoryIds.has(t.categoryId))).map(task => {
                const start = new Date(task.startDate);
                const end = new Date(task.endDate);
                const category = categories.find(c => c.id === task.categoryId);
                const color = category ? category.color : 'var(--brand-primary)';
                
                const top = (start.getHours() + start.getMinutes() / 60) * 48; // 48px per hour
                const height = ((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 48;

                return (
                  <div 
                    key={task.id} 
                    className="event-block"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: color,
                    }}
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'OPEN_TASK_MODAL', payload: task.id }); }}
                  >
                    <div className="event-title">{task.title}</div>
                    <div className="event-time">{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
