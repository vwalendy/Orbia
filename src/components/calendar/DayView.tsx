import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { format, isSameDay } from 'date-fns';
import './WeekView.css'; // Reusing WeekView styles

export function DayView() {
  const { currentDate, tasks, categories, hiddenCategoryIds, dispatch } = useCalendar();

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-col-header"></div>
        <div className="day-col-header today" style={{ borderRight: 'none' }}>
          <span className="day-name">{format(currentDate, 'EEEE')}</span>
          <span className="day-date">
            <span className="today-circle">{format(currentDate, 'd')}</span>
          </span>
        </div>
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
          <div className="day-col" style={{ borderRight: 'none' }}>
            {hours.map(hour => (
              <div className="time-slot" key={hour}></div>
            ))}
            
            {tasks.filter(t => isSameDay(new Date(t.startDate), currentDate) && (!t.categoryId || !hiddenCategoryIds.has(t.categoryId))).map(task => {
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
        </div>
      </div>
    </div>
  );
}
