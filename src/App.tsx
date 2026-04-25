import React from 'react';
import { CalendarProvider } from './context/CalendarContext';
import { AppShell } from './components/layout/AppShell';
import { Calendar } from './components/calendar/Calendar';
import { TaskModal } from './components/tasks/TaskModal';

function App() {
  return (
    <CalendarProvider>
      <AppShell>
        <Calendar />
      </AppShell>
      <TaskModal />
    </CalendarProvider>
  );
}

export default App;
