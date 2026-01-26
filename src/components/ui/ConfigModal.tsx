import React, { useState, useEffect } from "react";
import { FiClock, FiCalendar, FiX, FiCheck } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";

export type ConfigType = {
  taskDisplayMode: "remaining" | "dateRange";
  sortBy: "default" | "progress" | "priority";
  showCompleted: boolean;
};

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigType;
  onSave: (newConfig: ConfigType) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [localConfig, setLocalConfig] = useState<ConfigType>(config);

  // Reset local state khi mở modal
  useEffect(() => {
    if (isOpen) setLocalConfig(config);
  }, [isOpen, config]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-brand-700">
            <IoSettingsOutline size={20} />
            <h3 className="font-bold text-lg">Cấu hình hiển thị</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Task Card Display */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Hiển thị thẻ nhiệm vụ
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setLocalConfig({
                    ...localConfig,
                    taskDisplayMode: "remaining",
                  })
                }
                className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 transition-all ${
                  localConfig.taskDisplayMode === "remaining"
                    ? "bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-300"
                }`}
              >
                <FiClock size={20} />
                <span className="text-sm font-medium">Thời gian còn lại</span>
              </button>
              <button
                onClick={() =>
                  setLocalConfig({
                    ...localConfig,
                    taskDisplayMode: "dateRange",
                  })
                }
                className={`flex flex-col items-center justify-center p-3 border rounded-xl gap-2 transition-all ${
                  localConfig.taskDisplayMode === "dateRange"
                    ? "bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-300"
                }`}
              >
                <FiCalendar size={20} />
                <span className="text-sm font-medium">Ngày bắt đầu - KT</span>
              </button>
            </div>
          </div>

          {/* Section 2: Sorting */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Sắp xếp ưu tiên
            </label>
            <select
              value={localConfig.sortBy}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  sortBy: e.target.value as any,
                })
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all cursor-pointer"
            >
              <option value="default">Mặc định</option>
              <option value="priority">Độ ưu tiên (Cao nhất trước)</option>
              <option value="progress">Tiến độ (Sắp hoàn thành trước)</option>
            </select>
          </div>

          {/* Section 3: Toggles */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Khác
            </label>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                Ẩn nhiệm vụ đã hoàn thành
              </span>
              <button
                onClick={() =>
                  setLocalConfig({
                    ...localConfig,
                    showCompleted: !localConfig.showCompleted,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  !localConfig.showCompleted ? "bg-gray-300" : "bg-brand-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    !localConfig.showCompleted
                      ? "translate-x-1"
                      : "translate-x-6"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onSave(localConfig);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-lg hover:bg-brand-700 shadow-md shadow-brand-200 transition-all flex items-center justify-center gap-2"
          >
            <FiCheck size={16} /> Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
