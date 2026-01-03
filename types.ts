
export enum Screen {
  DASHBOARD = 'DASHBOARD',
  QUEUE = 'QUEUE',
  JOB_DETAILS = 'JOB_DETAILS',
  SETTINGS = 'SETTINGS',
  UPLOAD = 'UPLOAD',
  COSTS = 'COSTS',
  BLOGS = 'BLOGS'
}

export type JobStatus = 'Running' | 'Failed' | 'Needs Review' | 'Published' | 'Queued' | 'Processing';

export interface Job {
  id: string;
  title: string;
  site: string;
  category: string;
  status: JobStatus;
  progress?: number;
  timestamp: string;
  icon?: string;
}

export interface Stat {
  label: string;
  value: string;
  trend?: string;
  icon: string;
  color: string;
}

export interface LogEntry {
  time: string;
  level: 'Success' | 'Info' | 'Warn' | 'Error';
  message: string;
}
