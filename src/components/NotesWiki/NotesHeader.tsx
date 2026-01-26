import { Plus, FileUp } from 'lucide-react';

interface NotesHeaderProps {
  onOpenDocUpload: () => void;
  onOpenModal: () => void;
  darkMode?: boolean;
}

export default function NotesHeader({ onOpenDocUpload, onOpenModal, darkMode = false }: NotesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 sm:pt-4 w-full">
      <div>
        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Notes & Wiki</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 ml-auto">
        <button
          onClick={onOpenDocUpload}
          className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-smooth btn-press text-sm sm:text-base"
        >
          <FileUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Tạo từ File</span>
          <span className="sm:hidden">File</span>
        </button>
        <button
          onClick={onOpenModal}
          className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-smooth btn-press text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Tạo ghi chú mới</span>
          <span className="sm:hidden">Thêm</span>
        </button>
      </div>
    </div>
  );
}