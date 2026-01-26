import { create } from 'zustand';

export type TaskStatus = 'todo' | 'inprogress' | 'urgent' | 'done';

export interface TeamTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: string;
  assigneeAvatar: string;
  deadline?: string;
  labels: string[];
  projectId?: string;
  createdAt: string;
}

export interface PersonalTask {
  id: string;
  title: string;
  status: TaskStatus;
  order: number;
  scheduledTime?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color?: string;
  linkedTaskId?: string;
  linkedTaskType?: 'team' | 'personal';
  attachments?: { name: string; url: string; size: number }[];
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

interface AppState {
  teamTasks: TeamTask[];
  personalTasks: PersonalTask[];
  notes: Note[];
  columns: Column[];
  isLoading: boolean;
  userId: string;
  

  initializeData: () => void;
  

  

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  updateColumn: (id: TaskStatus, updates: Partial<Column>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// LocalStorage keys
const STORAGE_KEYS = {
  TEAM_TASKS: 'team_tasks',
  PERSONAL_TASKS: 'personal_tasks',
  NOTES: 'notes',
  COLUMNS: 'columns',
};

const loadFromStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const useStore = create<AppState>((set) => ({
  columns: [],
  teamTasks: [],
  personalTasks: [],
  notes: [],
  isLoading: false,
  userId: 'demo',
  
  // Initialize data from localStorage
  initializeData: () => {

    set({ isLoading: true });
    
    const defaultColumns = [
      { id: 'todo' as TaskStatus, title: 'Cần làm', color: 'bg-gray-100' },
      { id: 'inprogress' as TaskStatus, title: 'Đang làm', color: 'bg-blue-100' },
      { id: 'urgent' as TaskStatus, title: 'Ưu tiên cao', color: 'bg-red-100' },
      { id: 'done' as TaskStatus, title: 'Hoàn thành', color: 'bg-green-100' },
    ];

    //mock data
    const defaultTeamTasks: TeamTask[] = [
      // TODO Status
      {
        id: 'team-1',
        title: 'Thiết kế Landing Page',
        description: 'Tạo design mockup cho landing page sản phẩm mới với Figma',
        status: 'todo',
        assignee: 'Nguyễn Văn A',
        assigneeAvatar: '👨‍🎨',
        deadline: '2026-01-25',
        labels: ['Design', 'Frontend'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      
      // IN PROGRESS Status
      {
        id: 'team-2',
        title: 'Thiết kế UI Dashboard',
        description: 'Tạo giao diện cho trang dashboard chính với hệ thống chart',
        status: 'inprogress',
        assignee: 'Lê Văn C',
        assigneeAvatar: '👨‍💻',
        deadline: '2026-01-20',
        labels: ['Design', 'Frontend', 'Priority'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
     
      // URGENT Status
      {
        id: 'team-3',
        title: 'Fix Critical Bug - Login Issue',
        description: 'Sửa lỗi không thể đăng nhập trên Safari và Firefox',
        status: 'urgent',
        assignee: 'Đỗ Minh E',
        assigneeAvatar: '🔴',
        deadline: '2026-01-17',
        labels: ['Bug', 'Critical', 'Hotfix'],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
     
      // DONE Status
      {
        id: 'team-4',
        title: 'Setup Project Repository',
        description: 'Tạo GitHub repo, CI/CD pipeline, và documentation cơ bản',
        status: 'done',
        assignee: 'Tạ Thanh G',
        assigneeAvatar: '✅',
        deadline: '2026-01-10',
        labels: ['Setup', 'DevOps'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
     
    ];

    const defaultPersonalTasks: PersonalTask[] = [
      {
        id: 'personal-1',
        title: 'Đọc React 18 Documentation',
        status: 'todo',
        order: 1,
        scheduledTime: '2026-01-17T09:00:00',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'personal-2',
        title: 'Viết unit test cho NotesWiki component',
        status: 'inprogress',
        order: 2,
        scheduledTime: '2026-01-17T14:00:00',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'personal-3',
        title: 'Review code từ team member',
        status: 'done',
        order: 3,
        scheduledTime: '2026-01-16T10:00:00',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
     
    ];

    const defaultNotes: Note[] = [
      // Linked to Team Task - URGENT (Red auto-color)
      {
        id: 'note-1',
        title: 'Login Bug - Browser Compatibility',
        content: '<p>Người dùng không thể đăng nhập trên Safari và Firefox</p><p>Nguyên nhân: Cookie policy khác nhau giữa các browser</p><p>Giải pháp: Cần cấu lại SameSite cookie attribute và xem xét CORS headers</p>',
        color: 'slate',
        attachments: [
          { name: 'bug-report.pdf', url: '/docs/bug-report.pdf', size: 1024 }
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Linked to Team Task - IN PROGRESS 
      {
        id: 'note-2',
        title: 'Dashboard Design Notes',
        content: '<p>Layout: Top navbar + Sidebar navigation + Main content area</p><p>Components cần thiết:</p><ul><li>StatCard - hiển thị metrics</li><li>Chart - line, bar, pie charts</li><li>Table - dữ liệu users/transactions</li><li>Filters - advanced filtering options</li></ul><p>Color scheme: Blue accent với neutral backgrounds</p>',
        
        linkedTaskId: 'team-3',
        linkedTaskType: 'team',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // Linked to Personal Task - IN PROGRESS \
      {
        id: 'note-3',
        title: 'TypeScript Generics Study Notes',
        content: 'Cách tạo reusable components và functions',
        color: 'yellow',
        attachments: [
          { name: 'typescript-guide.md', url: '/docs/typescript-guide.md', size: 5120 },
          { name: 'examples.ts', url: '/docs/examples.ts', size: 2048 }
        ],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Standalone Note with Orange color
      {
        id: 'note-4',
        title: 'Project Ideas - Features to Consider',
        content: 'Dark mode support - Real-time notifications',
        color: 'orange',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // Standalone Note with Green color
      {
        id: 'note-5',
        title: 'Performance Tips & Best Practices',
        content: 'React Optimization - UI Performance',
        color: 'green',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      
    
    ];

    // Load from localStorage, use default if empty
    const storedTeamTasks = loadFromStorage(STORAGE_KEYS.TEAM_TASKS, null);
    const storedPersonalTasks = loadFromStorage(STORAGE_KEYS.PERSONAL_TASKS, null);
    const storedNotes = loadFromStorage(STORAGE_KEYS.NOTES, null);
    const storedColumns = loadFromStorage(STORAGE_KEYS.COLUMNS, null);
    
    const teamTasks = storedTeamTasks && storedTeamTasks.length > 0 ? storedTeamTasks : defaultTeamTasks;
    const personalTasks = storedPersonalTasks && storedPersonalTasks.length > 0 ? storedPersonalTasks : defaultPersonalTasks;
    const notes = storedNotes && storedNotes.length > 0 ? storedNotes : defaultNotes;
    const columns = storedColumns && storedColumns.length > 0 ? storedColumns : defaultColumns;
    
    
    if (!storedTeamTasks || storedTeamTasks.length === 0) {
      saveToStorage(STORAGE_KEYS.TEAM_TASKS, teamTasks);
    }
    if (!storedPersonalTasks || storedPersonalTasks.length === 0) {
      saveToStorage(STORAGE_KEYS.PERSONAL_TASKS, personalTasks);
    }
    if (!storedColumns || storedColumns.length === 0) {
      saveToStorage(STORAGE_KEYS.COLUMNS, columns);
    }
    
    set({
      teamTasks,
      personalTasks,
      notes,
      columns,
      isLoading: false,
    });
  },
  
  addNote: (note) => {
    const newNote = {
      ...note,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedNotes = [...state.notes, newNote];
      saveToStorage(STORAGE_KEYS.NOTES, updatedNotes);
      return { notes: updatedNotes };
    });
  },

  updateNote: (id, updates) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      );
      saveToStorage(STORAGE_KEYS.NOTES, updatedNotes);
      return { notes: updatedNotes };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      saveToStorage(STORAGE_KEYS.NOTES, updatedNotes);
      return { notes: updatedNotes };
    });
  },

  togglePinNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id
          ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() }
          : note
      );
      saveToStorage(STORAGE_KEYS.NOTES, updatedNotes);
      return { notes: updatedNotes };
    });
  },

  // Column Actions
  updateColumn: (id, updates) => {
    set((state) => {
      const updatedColumns = state.columns.map((col) =>
        col.id === id ? { ...col, ...updates } : col
      );
      saveToStorage(STORAGE_KEYS.COLUMNS, updatedColumns);
      return { columns: updatedColumns };
    });
  },
}));