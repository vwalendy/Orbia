export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval?: number;
  daysOfWeek?: number[]; // For weekly (0=Sun, 1=Mon, etc)
  endDate?: string; // ISO date string
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  categoryIds: string[]; // Supports multiple categories
  recurrence?: RecurrenceRule;
}

export type ViewType = 'month' | 'week' | 'day';
