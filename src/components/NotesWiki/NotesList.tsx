import { Link2, FileText } from 'lucide-react';
import type { Note, TaskStatus } from './store';
import NoteCard from './NoteCard';
import PaginationControls from './PaginationControls';
import './paginationAnimations.css';

const getAutoColor = (status: TaskStatus): string => {
  const colorMap: Record<TaskStatus, string> = {
    'todo': '',           
    'inprogress': 'yellow',  
    'done': 'green',      
    'urgent': 'red',  
  };
  return colorMap[status] || '';
};

interface NotesListProps {
  linkedNotes: Note[];
  standaloneNotes: Note[];
  linkedPaginatedNotes: Note[];
  standalonePaginatedNotes: Note[];
  linkedCurrentPage: number;
  setLinkedCurrentPage: (page: number) => void;
  linkedTotalPages: number;
  standaloneCurrentPage: number;
  setStandaloneCurrentPage: (page: number) => void;
  standaloneTotalPages: number;
  itemsPerPage: number;
  getLinkedTask: (note: Note) => any;
  getContentPreview: (content: string, wordCount?: number) => string;
  handleOpenModal: (note?: Note) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  NOTE_COLORS: any[];
}

export default function NotesList({
  linkedNotes,
  standaloneNotes,
  linkedPaginatedNotes,
  standalonePaginatedNotes,
  linkedCurrentPage,
  setLinkedCurrentPage,
  linkedTotalPages,
  standaloneCurrentPage,
  setStandaloneCurrentPage,
  standaloneTotalPages,
  itemsPerPage,
  getLinkedTask,
  getContentPreview,
  handleOpenModal,
  deleteNote,
  togglePinNote,
  NOTE_COLORS,
}: NotesListProps) {
  return (
    <>
      {/* Linked */}
      {linkedNotes.length > 0 && (
        <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-700">
              <Link2 className="w-5 h-5" />
              Ghi chú liên kết 
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">
              Hiển thị {(linkedCurrentPage - 1) * itemsPerPage + 1}-{Math.min(linkedCurrentPage * itemsPerPage, linkedNotes.length)} / {linkedNotes.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {linkedPaginatedNotes.map((note) => {
              const linkedTask = getLinkedTask(note);
              const colorValue = note.color || (linkedTask && 'status' in linkedTask ? getAutoColor((linkedTask as any).status) : '');
              const noteColor = NOTE_COLORS.find(c => c.value === colorValue);

              return (
                <div key={note.id} className="page-enter-stagger">
                  <NoteCard
                    note={note}
                    onEdit={handleOpenModal}
                    onDelete={deleteNote}
                    onPin={togglePinNote}
                    linkedTask={linkedTask}
                    getContentPreview={getContentPreview}
                    noteColor={noteColor}
                  />
                </div>
              );
            })}
          </div>

          <PaginationControls
            currentPage={linkedCurrentPage}
            totalPages={linkedTotalPages}
            onPageChange={setLinkedCurrentPage}
          />
        </div>
      )}

      {/* Standalone */}
      {standaloneNotes.length > 0 && (
        <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gray-700">
              <FileText className="w-5 h-5" />
              Ghi chú độc lập 
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">
              Hiển thị {(standaloneCurrentPage - 1) * itemsPerPage + 1}-{Math.min(standaloneCurrentPage * itemsPerPage, standaloneNotes.length)} / {standaloneNotes.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {standalonePaginatedNotes.map((note) => {
              const noteColor = NOTE_COLORS.find(c => c.value === note.color);

              return (
                <div key={note.id} className="page-enter-stagger">
                  <NoteCard
                    note={note}
                    onEdit={handleOpenModal}
                    onDelete={deleteNote}
                    onPin={togglePinNote}
                    linkedTask={undefined}
                    getContentPreview={getContentPreview}
                    noteColor={noteColor}
                  />
                </div>
              );
            })}
          </div>

          <PaginationControls
            currentPage={standaloneCurrentPage}
            totalPages={standaloneTotalPages}
            onPageChange={setStandaloneCurrentPage}
          />
        </div>
      )}

      {linkedNotes.length === 0 && standaloneNotes.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Không có ghi chú nào</h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Bắt đầu tạo ghi chú để tổ chức ý tưởng và thông tin của bạn</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-smooth text-sm font-medium"
            >
              ✨ Tạo ghi chú mới
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-100 text-left space-y-3">
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="flex-shrink-0">📝</span>
                <span><strong>Tạo ghi chú:</strong> Nhấp nút "Tạo ghi chú mới" để tạo ghi chú độc lập hoặc liên kết với task</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">📎</span>
                <span><strong>Đính kèm file:</strong> Khi tạo ghi chú, bạn có thể upload file đính kèm (tối đa 10MB)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">🏷️</span>
                <span><strong>Liên kết task:</strong> Liên kết ghi chú với team task hoặc personal task để tổ chức tốt hơn</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">📌</span>
                <span><strong>Ghim ghi chú:</strong> Ghim ghi chú quan trọng để dễ tìm kiếm</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}