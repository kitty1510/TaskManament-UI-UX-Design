import { X, Clock, Paperclip, Link2, Pin, User, Users } from 'lucide-react';
import type { Note } from './store';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  linkedTask?: any;
  getContentPreview: (content: string, wordCount?: number) => string;
  noteColor: { name: string; value: string; bg: string; border: string; darkBg?: string; darkBorder?: string } | undefined;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onPin,
  linkedTask,
  getContentPreview,
  noteColor,
}: NoteCardProps) {
  const bgClass = noteColor?.bg || 'bg-white';
  const borderClass = noteColor?.border || 'border-gray-200';

  const getTaskTypeIcon = () => {
    if (!linkedTask) return null;
    const isTeam = linkedTask.type === 'team' || linkedTask.assignedTo?.length > 1;
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
        isTeam
          ? 'bg-purple-100 text-purple-700'
          : 'bg-green-100 text-green-700'
      }`}>
        {isTeam ? (
          <>
            <Users className="w-3 h-3" />
            <span>Team</span>
          </>
        ) : (
          <>
            <User className="w-3 h-3" />
            <span>Personal</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => onEdit(note)}
      className={`${bgClass} border-2 ${borderClass} rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow cursor-pointer relative z-0`}
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 flex-1 line-clamp-2">{note.title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin(note.id);
            }}
            className={`transition-all duration-200 hover:scale-125 active:scale-110 cursor-pointer ${
              note.pinned
                ? 'text-yellow-500'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
            title={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className={`w-4 h-4 ${note.pinned ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
                onDelete(note.id);
              }
            }}
            className="transition-all duration-200 hover:scale-125 active:scale-110 cursor-pointer text-gray-400 hover:text-red-500"
            title="Delete note"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="text-xs sm:text-sm font-medium mb-2 line-clamp-2 text-blue-600">
        📝 {getContentPreview(note.content, 8)}
      </div>
      
      {note.attachments && note.attachments.length > 0 && (
        <div className="flex items-center gap-1 text-xs mb-2 text-gray-500">
          <Paperclip className="w-3 h-3" />
          <span>{note.attachments.length} Tệp</span>
        </div>
      )}
      
      {linkedTask && (
        <div className="mb-2">
          <div className="flex items-center gap-2 p-2 rounded border text-xs sm:text-sm font-semibold transition-all duration-200 hover:shadow-md cursor-pointer bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100">
            <Link2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-blue-600" />
            <span className="truncate font-bold">{linkedTask.title}</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(note.updatedAt).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        {linkedTask && getTaskTypeIcon()}
      </div>
    </div>
  );
}