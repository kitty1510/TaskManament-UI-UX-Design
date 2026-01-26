import { Filter, ChevronDown } from 'lucide-react';
import type { Note } from './store';

interface NotesFilterMenuProps {
  showFilterMenu: boolean;
  setShowFilterMenu: (show: boolean) => void;
  filterTypes: Set<'linked' | 'standalone'>;
  setFilterTypes: (types: Set<'linked' | 'standalone'>) => void;
  filterAttachmentTypes: Set<'with' | 'without'>;
  setFilterAttachmentTypes: (types: Set<'with' | 'without'>) => void;
  totalLinked: number;
  totalStandalone: number;
  totalWithAttachments: number;
  notes: Note[];
}

export default function NotesFilterMenu({
  showFilterMenu,
  setShowFilterMenu,
  filterTypes,
  setFilterTypes,
  filterAttachmentTypes,
  setFilterAttachmentTypes,
  notes,
}: NotesFilterMenuProps) {
  return (
    <>
      <button
        data-filter-menu="true"
        onClick={() => setShowFilterMenu(!showFilterMenu)}
        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-900"
      >
        <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline"></span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
      </button>

      {showFilterMenu && (
        <div 
          data-filter-container="true" 
          className="absolute top-full mt-2 right-0 border border-gray-300 rounded-lg shadow-lg z-10 w-full sm:w-96 max-h-96 overflow-y-auto bg-white"
        >
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            
            <div className="border-b border-gray-200 pb-3 sm:pb-4">
              <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700">Loại ghi chú</p>
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-1 sm:p-2 rounded transition-colors text-xs sm:text-sm hover:bg-gray-50 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterTypes.size === 0}
                    onChange={() => setFilterTypes(new Set())}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span>Tất cả ({notes.length})</span>
                </label>
                
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-1 sm:p-2 rounded transition-colors text-xs sm:text-sm hover:bg-gray-50 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterTypes.has('linked')}
                    onChange={() => {
                      const newSet = new Set(filterTypes);
                      newSet.has('linked') ? newSet.delete('linked') : newSet.add('linked');
                      setFilterTypes(newSet);
                    }}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span>Liên kết </span>
                </label>
                
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-1 sm:p-2 rounded transition-colors text-xs sm:text-sm hover:bg-gray-50 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterTypes.has('standalone')}
                    onChange={() => {
                      const newSet = new Set(filterTypes);
                      newSet.has('standalone') ? newSet.delete('standalone') : newSet.add('standalone');
                      setFilterTypes(newSet);
                    }}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span>Độc lập </span>
                </label>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-3 sm:pb-4">
              <p className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700">Tệp đính kèm</p>
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-1 sm:p-2 rounded transition-colors text-xs sm:text-sm hover:bg-gray-50 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterAttachmentTypes.size === 0}
                    onChange={() => setFilterAttachmentTypes(new Set())}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span>Tất cả</span>
                </label>
                
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-1 sm:p-2 rounded transition-colors text-xs sm:text-sm hover:bg-gray-50 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterAttachmentTypes.has('with')}
                    onChange={() => {
                      const newSet = new Set(filterAttachmentTypes);
                      newSet.has('with') ? newSet.delete('with') : newSet.add('with');
                      setFilterAttachmentTypes(newSet);
                    }}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span>Có đính kèm </span>
                </label>
                
                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer p-1 sm:p-2 rounded transition-colors text-xs sm:text-sm hover:bg-gray-50 text-gray-700">
                  <input
                    type="checkbox"
                    checked={filterAttachmentTypes.has('without')}
                    onChange={() => {
                      const newSet = new Set(filterAttachmentTypes);
                      newSet.has('without') ? newSet.delete('without') : newSet.add('without');
                      setFilterAttachmentTypes(newSet);
                    }}
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span>Không đính kèm </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}