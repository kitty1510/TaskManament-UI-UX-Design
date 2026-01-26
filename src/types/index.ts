export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
    initials: string;
  };
  status: 'overdue' | 'completed' | 'normal';
  tags?: string[];
}

export interface Column {
  id: string;
  title: string;
  color: string;
  count: number;
  tasks: Task[];
}
