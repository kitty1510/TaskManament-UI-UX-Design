import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Link2, Paperclip, Download, Trash2, Upload, Palette } from 'lucide-react';
import type { Note, TaskStatus } from './store';
import RichTextEditor from './RichTextEditor';

const getAutoColor = (status: TaskStatus): string => {
  const colorMap: Record<TaskStatus, string> = {
    'todo': 'slate',
    'inprogress': 'yellow',
    'done': 'green',
    'urgent': 'red',
  };
  return colorMap[status] || '';
};

const getStatusBadge = (status: TaskStatus): { 
  bg: string; 
  text: string; 
  border: string;
  dot: string;
  label: string;
} => {
  const statusMap: Record<TaskStatus, { bg: string; text: string; border: string; dot: string; label: string }> = {
    'todo': { 
      bg: 'bg-slate-100', 
      text: 'text-slate-700',
      border: 'border-slate-300',
      dot: 'bg-slate-400',
      label: 'To Do' 
    },
    'inprogress': { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      dot: 'bg-yellow-500',
      label: 'In Progress' 
    },
    'done': { 
      bg: 'bg-green-100', 
      text: 'text-green-700',
      border: 'border-green-300',
      dot: 'bg-green-600',
      label: 'Done' 
    },
    'urgent': { 
      bg: 'bg-red-100', 
      text: 'text-red-700',
      border: 'border-red-300',
      dot: 'bg-red-600',
      label: 'Urgent' 
    },
  };
  return statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-400', label: 'Unknown' };
};

interface NoteModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editingNote: Note | null;
  formData: {
    title: string;
    content: string;
    color: string;
    linkedTaskId: string;
    linkedTaskType: 'team' | 'personal';
    attachments: { name: string; url: string; size: number }[];
  };
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleRemoveAttachment: (index: number) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  allTasks: any[];
  NOTE_COLORS: any[];
  uploadingFiles: boolean;
  uploadProgress: number;
}

export default function NoteModal({
  showModal,
  setShowModal,
  editingNote,
  formData,
  setFormData,
  handleSubmit,
  handleRemoveAttachment,
  handleFileUpload,
  allTasks,
  NOTE_COLORS,
  uploadingFiles,
  uploadProgress,
}: NoteModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (showModal) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.transition = 'padding-right 300ms ease-out';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.style.transition = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.style.transition = '';
    };
  }, [showModal]);

  if (!showModal) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const modal = (
    <div 
      className={`fixed inset-0 modal-overlay backdrop-blur-lg bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
      style={{ height: '100dvh' }}
    >
      <div 
        className={`rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden modal-content transition-all duration-300 flex flex-col bg-white ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 p-4 sm:p-6 bg-white">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {editingNote ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded transition-smooth flex-shrink-0 hover:bg-gray-100 text-gray-900"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        
        {/* Form content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm mb-2 font-medium text-gray-700">Tiêu đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg input-focus text-sm bg-white text-gray-900 placeholder-gray-400"
              placeholder="Nhập tiêu đề ghi chú"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs sm:text-sm mb-2 font-medium text-gray-700">Nội dung</label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          </div>

          {/* Task Link */}
          <div>
            <label className="block text-xs sm:text-sm mb-2 font-medium text-gray-700">
              <Link2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Liên kết với Task</span>
              <span className="sm:hidden">Task</span>
            </label>
            <select
              value={formData.linkedTaskId}
              onChange={(e) => {
                const selectedTask = allTasks.find((t) => t.id === e.target.value);
                let autoColor = formData.color;
                if (e.target.value && selectedTask && 'status' in selectedTask) {
                  autoColor = getAutoColor((selectedTask as any).status) || formData.color;
                }
                setFormData({
                  ...formData,
                  linkedTaskId: e.target.value,
                  linkedTaskType: selectedTask?.type || 'team',
                  color: autoColor,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg input-focus text-sm bg-white text-gray-900"
            >
              <option value="">-- Không liên kết --</option>
              <optgroup label="Team Tasks">
                {allTasks.filter((t) => t.type === 'team').map((task) => (
                  <option key={task.id} value={task.id}>{task.title}</option>
                ))}
              </optgroup>
              <optgroup label="Personal Tasks">
                {allTasks.filter((t) => t.type === 'personal').map((task) => (
                  <option key={task.id} value={task.id}>{task.title}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {formData.linkedTaskId && (
            <div className="border border-blue-300 rounded-lg p-2 sm:p-3 bg-blue-100">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Link2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-blue-600" />
                  <span className="text-xs sm:text-sm font-medium truncate text-blue-900">
                    Liên kết: {allTasks.find((t) => t.id === formData.linkedTaskId)?.title || ''}
                  </span>
                </div>
                {(() => {
                  const linkedTask = allTasks.find((t) => t.id === formData.linkedTaskId);
                  if (linkedTask && 'status' in linkedTask) {
                    const statusBadge = getStatusBadge((linkedTask as any).status);
                    return (
                      <div className={`flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 border rounded-lg whitespace-nowrap ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                        <span className="text-xs font-medium">{statusBadge.label}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          )}

          
          <div>
            <label className="block text-xs sm:text-sm mb-2 font-medium text-gray-700">
              <Palette className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Màu sắc ghi chú</span>
              <span className="sm:hidden">Màu</span>
              {formData.linkedTaskId && <span className="text-gray-500 text-xs ml-1">(Tự động theo trạng thái task)</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`${color.bg} ${color.border} border-2 rounded-lg px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm transition-smooth cursor-pointer ${
                    formData.color === color.value
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : 'hover:shadow-md'
                  }`}
                  title={color.name}
                >
                  <span className="hidden sm:inline">{color.name}</span>
                  <span className="sm:hidden">{color.name.substring(0, 1)}</span>
                </button>
              ))}
            </div>
          </div>

          
          <div>
            <label className="block text-xs sm:text-sm mb-2 font-medium text-gray-700">
              <Paperclip className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Tệp đính kèm
            </label>

            <div className="space-y-2 pb-2">
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 border border-gray-200 rounded-lg gap-2 bg-gray-50">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-400" />
                    <span className="text-xs sm:text-sm truncate text-gray-900">{file.name}</span>
                    <span className="text-xs flex-shrink-0 whitespace-nowrap text-gray-500">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a
                      href={file.url}
                      download={file.name}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-gray-200 text-gray-600"
                      title="Tải xuống"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                      title="Xóa"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingFiles}
                />
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-3 w-full p-6 sm:p-8 border-2 border-dashed rounded-lg cursor-pointer transition-smooth text-xs sm:text-sm text-gray-600 ${
                    uploadingFiles 
                      ? 'border-blue-400 bg-blue-50 cursor-not-allowed' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {uploadingFiles ? (
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5 animate-pulse text-blue-600" />
                        <span className="font-medium text-gray-900">Đang tải lên...</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">{uploadProgress}%</span>
                        </div>
                        <div className="w-full rounded-full h-3 bg-gray-200 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out shadow-sm" 
                            style={{ width: `${uploadProgress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-center">Click để chọn file (Max 10MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex flex-col sm:flex-row gap-2 justify-end pt-4 px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded-lg transition-smooth btn-press disabled:opacity-50 text-sm order-2 sm:order-1 font-medium text-gray-600 hover:bg-gray-100"
            disabled={uploadingFiles}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-smooth btn-press disabled:opacity-50 text-sm order-1 sm:order-2 font-medium"
            disabled={uploadingFiles}
          >
            {editingNote ? 'Cập nhật' : 'Tạo ghi chú'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}