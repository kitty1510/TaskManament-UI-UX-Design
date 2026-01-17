import { X, FileText, Tag, Paperclip, Search } from 'lucide-react';

interface NotesActiveFiltersProps {
  filterTypes: Set<'linked' | 'standalone'>;
  setFilterTypes: (types: Set<'linked' | 'standalone'>) => void;
  filterTask: string;
  setFilterTask: (task: string) => void;
  filterAttachmentTypes: Set<'with' | 'without'>;
  setFilterAttachmentTypes: (types: Set<'with' | 'without'>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredNotesCount: number;
  allTasks: any[];
}

export default function NotesActiveFilters({
  filterTypes,
  setFilterTypes,
  filterTask,
  setFilterTask,
  filterAttachmentTypes,
  setFilterAttachmentTypes,
  searchQuery,
  setSearchQuery,
  filteredNotesCount,
  allTasks,
}: NotesActiveFiltersProps) {
  if (!filterTask && !searchQuery && filterTypes.size === 0 && filterAttachmentTypes.size === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs sm:text-sm text-gray-600 w-full sm:w-auto">Đang lọc:</span>
      
      {Array.from(filterTypes).map((type) => (
        <div key={type} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
          <FileText className="w-3 h-3 flex-shrink-0" />
          <span className="hidden sm:inline">{type === 'linked' ? 'Liên kết' : 'Độc lập'}</span>
          <span className="sm:hidden">{type === 'linked' ? 'LK' : 'ĐL'}</span>
          <button 
            onClick={() => {
              const newSet = new Set(filterTypes);
              newSet.delete(type);
              setFilterTypes(newSet);
            }} 
            className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {filterTask && (
        <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm max-w-xs sm:max-w-sm">
          <Tag className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {allTasks.find(t => t.id === filterTask)?.title || 'Unknown'}
          </span>
          <button 
            onClick={() => setFilterTask('')} 
            className="hover:bg-purple-200 rounded-full p-0.5 ml-1 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {Array.from(filterAttachmentTypes).map((attachmentType) => (
        <div key={attachmentType} className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
          <Paperclip className="w-3 h-3 flex-shrink-0" />
          <span className="hidden sm:inline">{attachmentType === 'with' ? 'Đính kèm' : 'Không đính kèm'}</span>
          <span className="sm:hidden">{attachmentType === 'with' ? 'CÓ' : 'KX'}</span>
          <button 
            onClick={() => {
              const newSet = new Set(filterAttachmentTypes);
              newSet.delete(attachmentType);
              setFilterAttachmentTypes(newSet);
            }} 
            className="hover:bg-green-200 rounded-full p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {searchQuery && (
        <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm max-w-xs">
          <Search className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">"{searchQuery}"</span>
          <button 
            onClick={() => setSearchQuery('')} 
            className="hover:bg-orange-200 rounded-full p-0.5 ml-1 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      <div className="text-xs sm:text-sm text-gray-500 w-full sm:w-auto">
        → {filteredNotesCount} Kết quả
      </div>
    </div>
  );
}