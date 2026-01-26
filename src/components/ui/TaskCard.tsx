import { Calendar } from 'lucide-react';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onClick: () => void;
}

const TaskCard = ({ task, onDragStart, onClick }: TaskCardProps) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200"
    >
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        {task.title}
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {task.status === 'overdue' && (
            <span className="flex items-center gap-1 text-red-500">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Overdue
            </span>
          )}
          {task.status === 'completed' && (
            <span className="flex items-center gap-1 text-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Completed
            </span>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{task.dueDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
            {task.assignee.initials}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
