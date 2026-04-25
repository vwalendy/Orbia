import React from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AppShell.css';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
