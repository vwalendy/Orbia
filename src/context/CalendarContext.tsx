import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Task, Category, ViewType } from '../types';

interface CalendarState {
  tasks: Task[];
  categories: Category[];
  currentDate: Date;
  viewType: ViewType;
  searchTerm: string;
  hiddenCategoryIds: Set<string>;
  isTaskModalOpen: boolean;
  editingTaskId: string | null;
}

export type CalendarAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_CURRENT_DATE'; payload: Date }
  | { type: 'SET_VIEW_TYPE'; payload: ViewType }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'TOGGLE_CATEGORY_VISIBILITY'; payload: string }
  | { type: 'OPEN_TASK_MODAL'; payload?: string } // Optional task ID
  | { type: 'CLOSE_TASK_MODAL' };

const initialState: CalendarState = {
  tasks: [],
  categories: [
    { id: '1', name: 'Work', color: 'var(--brand-primary)' },
    { id: '2', name: 'Personal', color: 'var(--accent-green)' },
    { id: '3', name: 'Health', color: 'var(--accent-red)' },
  ],
  currentDate: new Date(),
  viewType: 'month',
  searchTerm: '',
  hiddenCategoryIds: new Set(),
  isTaskModalOpen: false,
  editingTaskId: null,
};

function calendarReducer(state: CalendarState, action: CalendarAction): CalendarState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case 'SET_CURRENT_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_VIEW_TYPE':
      return { ...state, viewType: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'TOGGLE_CATEGORY_VISIBILITY': {
      const newHidden = new Set(state.hiddenCategoryIds);
      if (newHidden.has(action.payload)) {
        newHidden.delete(action.payload);
      } else {
        newHidden.add(action.payload);
      }
      return { ...state, hiddenCategoryIds: newHidden };
    }
    case 'OPEN_TASK_MODAL':
      return { ...state, isTaskModalOpen: true, editingTaskId: action.payload || null };
    case 'CLOSE_TASK_MODAL':
      return { ...state, isTaskModalOpen: false, editingTaskId: null };
    default:
      return state;
  }
}

interface CalendarContextProps extends CalendarState {
  dispatch: React.Dispatch<CalendarAction>;
}

const CalendarContext = createContext<CalendarContextProps | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
