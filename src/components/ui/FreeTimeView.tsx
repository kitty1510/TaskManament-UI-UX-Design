import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import ScheduleHeaderButtons from "./ScheduleHeaderButtons";

// --- HELPER FUNCTIONS ---
const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];
const formatDateDisplay = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

interface FreeTimeViewProps {
  onBack: () => void;
  onOpenConfig: () => void;
}

const FreeTimeView: React.FC<FreeTimeViewProps> = ({
  onBack,
  onOpenConfig,
}) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    setFromDate(formatDateForInput(today));
    setToDate(formatDateForInput(nextWeek));
  }, []);

  const mockFreeSlots = [
    {
      date: fromDate || "2026-04-22",
      slots: [
        "07:00 - 8:15",
        "09:00 - 10:15",
        "13:00 - 14:15",
        "15:00 - 16:30",
        "19:00 - 21:00",
      ],
    },
    {
      date: toDate || "2026-04-23",
      slots: [
        "07:00 - 8:15",
        "09:00 - 10:15",
        "13:00 - 14:15",
        "15:00 - 16:30",
        "19:00 - 21:00",
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-text-main cursor-pointer"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-text-main">
            Giờ rảnh của tôi
          </h1>
        </div>

        <ScheduleHeaderButtons
          onFreeTimeClick={() => {}}
          onConfigClick={onOpenConfig}
        />
      </header>

      {/* Body content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-muted">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-app-border rounded-lg text-text-main font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-muted">Đến ngày</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-app-border rounded-lg text-text-main font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-muted">
            Trong khoảng
          </label>
          <input
            type="text"
            defaultValue="00:00 - 23:00"
            className="w-full px-4 py-2.5 bg-white border border-app-border rounded-lg text-text-main font-medium focus:outline-none focus:border-brand-500 shadow-sm"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-custom space-y-4 pb-4">
        {mockFreeSlots.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-app-border rounded-xl p-1 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-full md:w-40 shrink-0 p-4 border-b md:border-b-0 md:border-r border-app-border/50 flex md:flex-col justify-between md:justify-center items-center md:items-start gap-2 bg-gray-50/50 rounded-l-lg">
              <span className="text-sm font-medium text-text-main">
                {formatDateDisplay(item.date)}
              </span>
              <span className="text-xs font-bold text-text-muted uppercase bg-gray-200/60 px-2 py-0.5 rounded">
                Thứ{" "}
                {new Date(item.date).getDay() + 1 === 1
                  ? "CN"
                  : new Date(item.date).getDay() + 1}
              </span>
            </div>
            <div className="flex-1 p-4 flex flex-wrap gap-3 items-center">
              {item.slots.map((slot, sIndex) => (
                <div
                  key={sIndex}
                  className="px-4 py-2 bg-white border border-app-border rounded-lg text-sm font-medium text-text-main shadow-sm hover:border-brand-400 hover:text-brand-600 cursor-pointer transition-all select-none"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeTimeView;
