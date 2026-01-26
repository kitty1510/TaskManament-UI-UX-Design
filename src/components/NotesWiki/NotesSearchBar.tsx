import { Search, HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface NotesSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode?: boolean;
}

export default function NotesSearchBar({ searchQuery, setSearchQuery, darkMode = false }: NotesSearchBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const InlineStyles = () => (
    <style>{`
      @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes tooltipFadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-8px); }
      }
      .tooltip-enter { animation: tooltipFadeIn 0.18s ease-out forwards; }
      .tooltip-exit  { animation: tooltipFadeOut 0.15s ease-out forwards; }
    `}</style>
  );

  const updatePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const tooltipWidth = 320;
    const gap = 8;
    let left = rect.right - tooltipWidth;
    if (left < gap) left = gap;
    if (left + tooltipWidth > window.innerWidth - gap) left = Math.max(window.innerWidth - tooltipWidth - gap, gap);
    const top = rect.bottom + gap;
    setPos({ top, left });
  };

  useEffect(() => {
    if (showTooltip) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [showTooltip]);

  const TooltipPortal = showTooltip ? createPortal(
    <div
      className="tooltip-enter fixed z-[99999] pointer-events-auto"
      style={{
        top: pos.top,
        left: pos.left,
        width: 320,
        maxWidth: 'calc(100vw - 16px)',
      }}
      role="tooltip"
      aria-hidden={!showTooltip}
    >
      <div className={`rounded-lg shadow-xl p-3 sm:p-4 space-y-2 sm:space-y-3 border text-xs sm:text-sm ${
        darkMode
          ? 'bg-slate-800 text-gray-100 border-slate-700'
          : 'bg-gray-900 text-white border-gray-700'
      }`}>
        <div className="font-semibold text-blue-300 mb-2 sm:mb-3">💡 Cú pháp tìm kiếm:</div>
        
        <div className="space-y-2 sm:space-y-3">
          <div>
            <p className="font-medium text-gray-200 mb-1">Tìm theo Task:</p>
            <code className="text-gray-300 text-xs bg-gray-800 px-2 py-1 rounded inline-block">
              task:dashboard
            </code>
            <p className="text-gray-400 text-xs mt-1">
              Tìm ghi chú liên kết với task có tên "dashboard"
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-200 mb-1">Tìm Task cá nhân:</p>
            <code className="text-gray-300 text-xs bg-gray-800 px-2 py-1 rounded inline-block">
              type:personal
            </code>
            <p className="text-gray-400 text-xs mt-1">
              Tìm ghi chú từ các task cá nhân của bạn
            </p>
          </div>

          <div>
            <p className="font-medium text-gray-200 mb-1">Tìm Task nhóm:</p>
            <code className="text-gray-300 text-xs bg-gray-800 px-2 py-1 rounded inline-block">
              type:team
            </code>
            <p className="text-gray-400 text-xs mt-1">
              Tìm ghi chú từ các task nhóm
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-2 sm:pt-3 mt-2 sm:mt-3">
          <p className="text-gray-400 text-xs">
            ℹ️ Tìm kiếm không phân biệt chữ hoa/thường
          </p>
        </div>

        <div style={{
          position: 'absolute',
          right: 12,
          top: -6,
          width: 12,
          height: 12,
          transform: 'rotate(45deg)',
          background: darkMode ? undefined : '#111827',
          borderLeft: darkMode ? '1px solid rgba(148,163,184,0.12)' : '1px solid rgba(55,65,81,0.6)',
        }} />
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative flex-1 min-w-0">
      <InlineStyles />

      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
        darkMode ? 'text-gray-500' : 'text-gray-400'
      }`} />
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm ghi chú... "
        className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          darkMode
            ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
        }`}
      />
      
      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            ref={buttonRef}
            type="button"
            className={`p-1 rounded transition-colors cursor-help flex-shrink-0 ${
              darkMode
                ? 'text-gray-500 hover:text-gray-300 hover:bg-slate-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title="Xem mẹo tìm kiếm"
            aria-describedby="search-tooltip"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {!showTooltip && (
            <div className="sr-only" id="search-tooltip">Tìm ghi chú liên kết với task cá nhân/nhóm hoặc task có tên cụ thể</div>
          )}
        </div>
      </div>

      {TooltipPortal}
    </div>
  );
}