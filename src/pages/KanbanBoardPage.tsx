import { useState } from 'react';
import { Search, Filter, User, Plus, ChevronDown } from 'lucide-react';
import type { Column, Task } from '../types';
import { initialKanbanData } from '../data/kanbanData';
import TaskCard from '../components/ui/TaskCard';
import TaskDetailModal from '../components/ui/TaskDetailModal';
import CreateTaskModal from '../components/ui/CreateTaskModal';

const KanbanBoardPage = () => {
  const [columns, setColumns] = useState<Column[]>(initialKanbanData);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; sourceColumnId: string } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalColumnId, setCreateModalColumnId] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [showAssigneeFilter, setShowAssigneeFilter] = useState(false);

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, sourceColumnId: columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return;

    const { task, sourceColumnId } = draggedTask;
    
    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== task.id),
            count: col.count - 1
          };
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, task],
            count: col.count + 1
          };
        }
        return col;
      });
      return newColumns;
    });

    setDraggedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = (taskData: {
    title: string;
    description: string;
    dueDate: string;
    assignee: string;
    columnId: string;
  }) => {
    const initials = taskData.assignee
      ? taskData.assignee.split(' ').map(n => n[0]).join('')
      : 'NU';

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate 
        ? new Date(taskData.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assignee: {
        name: taskData.assignee || 'Unassigned',
        avatar: '',
        initials: initials
      },
      status: 'normal'
    };

    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === taskData.columnId
          ? { ...col, tasks: [...col.tasks, newTask], count: col.count + 1 }
          : col
      )
    );
  };

  const openCreateModal = (columnId: string) => {
    setCreateModalColumnId(columnId);
    setIsCreateModalOpen(true);
  };

  const getUniqueAssignees = () => {
    const assignees = new Set<string>();
    columns.forEach(col => {
      col.tasks.forEach(task => {
        assignees.add(task.assignee.name);
      });
    });
    return Array.from(assignees);
  };

  const getFilteredTasks = (tasks: Task[]) => {
    if (selectedAssignee === 'all') return tasks;
    return tasks.filter(task => task.assignee.name === selectedAssignee);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded transform rotate-45"></div>
            <h1 className="text-2xl font-semibold text-gray-900">Project Board</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowAssigneeFilter(!showAssigneeFilter)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>
                  {selectedAssignee === 'all' ? 'All Assignees' : selectedAssignee}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showAssigneeFilter && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div 
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${selectedAssignee === 'all' ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => {
                      setSelectedAssignee('all');
                      setShowAssigneeFilter(false);
                    }}
                  >
                    All Assignees
                  </div>
                  {getUniqueAssignees().map(assignee => (
                    <div
                      key={assignee}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${selectedAssignee === assignee ? 'bg-blue-50 text-blue-600' : ''}`}
                      onClick={() => {
                        setSelectedAssignee(assignee);
                        setShowAssigneeFilter(false);
                      }}
                    >
                      {assignee}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {columns.map(column => (
            <div
              key={column.id}
              className="bg-gray-100 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold uppercase" style={{ color: column.color }}>
                    {column.title}
                  </h2>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {column.count}
                  </span>
                </div>
                <button 
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => openCreateModal(column.id)}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {getFilteredTasks(column.tasks).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={() => handleDragStart(task, column.id)}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateTaskModal
          columnId={createModalColumnId}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
};

export default KanbanBoardPage;
