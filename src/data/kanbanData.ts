import type { Column } from '../types';

export const initialKanbanData: Column[] = [
  {
    id: 'todo',
    title: 'TO DO',
    color: '#3b82f6',
    count: 3,
    tasks: [
      {
        id: 'task-1',
        title: 'Draft project specs and wireframes',
        dueDate: 'Oct 24',
        assignee: {
          name: 'John Doe',
          avatar: '',
          initials: 'JD'
        },
        status: 'normal'
      },
      {
        id: 'task-2',
        title: 'Stakeholder interview summary',
        dueDate: 'Oct 26',
        assignee: {
          name: 'Jane Smith',
          avatar: '',
          initials: 'JS'
        },
        status: 'overdue'
      },
      {
        id: 'task-3',
        title: 'Design landing page assets',
        dueDate: 'Oct 26',
        assignee: {
          name: 'Mike Wilson',
          avatar: '',
          initials: 'MW'
        },
        status: 'normal'
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'IN PROGRESS',
    color: '#f59e0b',
    count: 2,
    tasks: [
      {
        id: 'task-4',
        title: 'Develop API integration for auth',
        dueDate: 'Oct 25',
        assignee: {
          name: 'Sarah Johnson',
          avatar: '',
          initials: 'SJ'
        },
        status: 'normal'
      },
      {
        id: 'task-5',
        title: 'User testing for onboarding flow',
        dueDate: 'Oct 28',
        assignee: {
          name: 'Tom Brown',
          avatar: '',
          initials: 'TB'
        },
        status: 'normal'
      }
    ]
  },
  {
    id: 'review',
    title: 'REVIEW',
    color: '#8b5cf6',
    count: 1,
    tasks: [
      {
        id: 'task-6',
        title: 'QA for Dashboard reporting module',
        dueDate: 'Oct 23',
        assignee: {
          name: 'Lisa Anderson',
          avatar: '',
          initials: 'LA'
        },
        status: 'normal'
      }
    ]
  },
  {
    id: 'done',
    title: 'DONE',
    color: '#10b981',
    count: 2,
    tasks: [
      {
        id: 'task-7',
        title: 'Initialize repository and CI/CD',
        dueDate: 'Oct 20',
        assignee: {
          name: 'Chris Lee',
          avatar: '',
          initials: 'CL'
        },
        status: 'completed'
      },
      {
        id: 'task-8',
        title: 'Define color palette and fonts',
        dueDate: 'Oct 21',
        assignee: {
          name: 'Emma Davis',
          avatar: '',
          initials: 'ED'
        },
        status: 'completed'
      }
    ]
  }
];
