import React from 'react';
import { useCalendar } from '../../context/CalendarContext';
import { Calendar, ChevronLeft, ChevronRight, Menu, Search } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import './Header.css';

export function Header() {
  const { currentDate, viewType, dispatch, searchTerm } = useCalendar();

  const handlePrevious = () => {
    switch (viewType) {
      case 'month': dispatch({ type: 'SET_CURRENT_DATE', payload: subMonths(currentDate, 1) }); break;
      case 'week': dispatch({ type: 'SET_CURRENT_DATE', payload: subWeeks(currentDate, 1) }); break;
      case 'day': dispatch({ type: 'SET_CURRENT_DATE', payload: subDays(currentDate, 1) }); break;
    }
  };

  const handleNext = () => {
    switch (viewType) {
      case 'month': dispatch({ type: 'SET_CURRENT_DATE', payload: addMonths(currentDate, 1) }); break;
      case 'week': dispatch({ type: 'SET_CURRENT_DATE', payload: addWeeks(currentDate, 1) }); break;
      case 'day': dispatch({ type: 'SET_CURRENT_DATE', payload: addDays(currentDate, 1) }); break;
    }
  };

  const handleToday = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  };

  let dateDisplay = '';
  if (viewType === 'month') {
    dateDisplay = format(currentDate, 'MMMM yyyy');
  } else if (viewType === 'week') {
    dateDisplay = `Week of ${format(currentDate, 'MMM d, yyyy')}`;
  } else {
    dateDisplay = format(currentDate, 'MMMM d, yyyy');
  }

  return (
    <header className="header-container">
      <div className="header-left">
        <button className="icon-btn"><Menu size={24} /></button>
        <div className="logo">
          <Calendar size={28} className="logo-icon" />
          <span className="logo-text">Planner</span>
        </div>
      </div>

      <div className="header-center">
        <button className="today-btn" onClick={handleToday}>Today</button>
        <div className="date-nav">
          <button className="nav-btn" onClick={handlePrevious} aria-label="Previous"><ChevronLeft size={20}/></button>
          <button className="nav-btn" onClick={handleNext} aria-label="Next"><ChevronRight size={20}/></button>
        </div>
        <h2 className="current-date-title">{dateDisplay}</h2>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
          />
        </div>
        <div className="view-switcher">
          <select 
            value={viewType} 
            onChange={(e) => dispatch({ type: 'SET_VIEW_TYPE', payload: e.target.value as any })}
            className="view-select"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </div>
      </div>
    </header>
  );
}
