import { X, FileText, User, Calendar } from 'lucide-react';
import type { Task } from '../../types';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex gap-3">
              <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                REVIEW
              </span>
              <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                DESIGN SYSTEM
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900">Fix bug UI</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400 mt-1" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Description</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                The navigation bar icons on mobile devices are slightly misaligned. Need to check the padding and flex alignment in the header component for screens under 768px.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Assigned to</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-700">VL</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Van Linh</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">Due date</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Oct 22, 2023</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase">Activity</span>
              </div>
              <textarea
                placeholder="Write a comment..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                Update Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
