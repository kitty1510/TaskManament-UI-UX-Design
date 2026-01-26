import React from "react";
import { FiChevronDown, FiSliders } from "react-icons/fi";

interface ScheduleHeaderButtonsProps {
  onFreeTimeClick: () => void;
  onConfigClick: () => void;
}

const ScheduleHeaderButtons: React.FC<ScheduleHeaderButtonsProps> = ({
  onFreeTimeClick,
  onConfigClick,
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Nút Giờ rảnh */}
      <button
        onClick={onFreeTimeClick}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-app-border rounded-app-button shadow-sm hover:border-brand-400 hover:bg-brand-50 transition-all group cursor-pointer h-10"
      >
        <span className="text-sm font-medium text-text-main group-hover:text-brand-600 transition-colors">
          Giờ rảnh
        </span>
        <FiChevronDown
          size={16}
          className="text-text-muted group-hover:text-brand-600 transition-colors"
        />
      </button>

      {/* Nút Cấu hình */}
      <button
        onClick={onConfigClick}
        className="flex items-center justify-center gap-2 px-5 py-2 bg-brand-600 text-white border border-transparent rounded-app-button font-medium text-sm hover:bg-brand-700 shadow-sm shadow-brand-200 transition-all cursor-pointer h-10"
      >
        <FiSliders size={16} />
        <span>Cấu hình</span>
      </button>
    </div>
  );
};

export default ScheduleHeaderButtons;
