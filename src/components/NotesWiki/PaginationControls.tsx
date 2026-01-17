import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-6 flex-wrap">
      
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-gray-600 hover:text-gray-900 ${
          currentPage === 1 ? '' : 'cursor-pointer hover:scale-125'
        }`}
        title="Trang trước"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Page numbers */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm cursor-pointer flex-shrink-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="text-xs sm:text-sm text-gray-400">...</span>
          )}
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium cursor-pointer flex-shrink-0 ${
            page === currentPage
              ? 'bg-blue-600 text-white border border-blue-600 hover:scale-105 hover:shadow-md'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-xs sm:text-sm text-gray-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm cursor-pointer flex-shrink-0 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-gray-600 hover:text-gray-900 ${
          currentPage === totalPages ? '' : 'cursor-pointer hover:scale-125'
        }`}
        title="Trang tiếp theo"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Page info */}
      <span className="text-xs sm:text-sm ml-2 flex-shrink-0 text-gray-600">
        {currentPage} / {totalPages}
      </span>
    </div>
  );
}