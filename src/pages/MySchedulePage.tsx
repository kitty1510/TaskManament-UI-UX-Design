import { useState } from "react";
import { FiClock, FiCalendar } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import { FiBell, FiMessageSquare, FiInfo } from "react-icons/fi";
import { TbNotification } from "react-icons/tb";
import ConfigModal from "../components/ui/ConfigModal";
import type { ConfigType } from "../components/ui/ConfigModal";
import FreeTimeView from "../components/ui/FreeTimeView";
import ScheduleHeaderButtons from "../components/ui/ScheduleHeaderButtons";

// --- MOCK DATA (Cập nhật thêm startDate, endDate, priority cho demo) ---
const missionsData = [
  {
    id: 1,
    subId: "Mission #03",
    title: "Code UI home page",
    timeLeft: "Còn lại 5 ngày",
    startDate: "20/04",
    endDate: "25/04",
    progress: 15,
    badge: "Nhóm",
    isRead: false,
    priority: "high",
  },
  {
    id: 2,
    subId: null,
    title: "Design System Update",
    timeLeft: "Hôm nay",
    startDate: "22/04",
    endDate: "22/04",
    progress: 90,
    badge: "Cá nhân",
    isRead: true,
    priority: "medium",
  },
  {
    id: 3,
    subId: "Mission #03",
    title: "Fix bug layout mobile",
    timeLeft: "Quá hạn 1 ngày",
    startDate: "15/04",
    endDate: "21/04",
    progress: 45,
    badge: "Nhóm",
    isRead: false,
    priority: "high",
  },
  {
    id: 4,
    subId: null,
    title: "Review Pull Request",
    timeLeft: "Còn lại 2 ngày",
    startDate: "20/04",
    endDate: "24/04",
    progress: 85,
    badge: "Nhóm",
    isRead: true,
    priority: "low",
  },
];

const activities = [
  {
    dateGroup: "Hôm nay",
    items: [
      {
        id: 1,
        title: "Họp nhóm đồ án",
        time: "7:30 - 8:00",
        badge: "Họp",
        color: "purple",
      },
      {
        id: 2,
        title: "Seminar công nghệ",
        time: "9:00 - 11:00",
        badge: "Tiết học",
        color: "blue",
      },
    ],
  },
  {
    dateGroup: "22/04/2026",
    items: [
      {
        id: 3,
        title: "Deadline nộp báo cáo",
        time: "23:59",
        badge: "Sự kiện",
        color: "red",
      },
      {
        id: 4,
        title: "Mentoring session",
        time: "14:00 - 15:30",
        badge: "Tiết học",
        color: "blue",
      },
    ],
  },
];

const notifications = [
  {
    dateGroup: "Mới nhất",
    items: [
      {
        id: 1,
        content: "Sếp vừa giao Mission #03",
        time: "08:00",
        type: "task",
      },
      {
        id: 2,
        content: "Bạn được tag vào comment",
        time: "09:15",
        type: "mention",
      },
    ],
  },
  {
    dateGroup: "Hôm qua",
    items: [
      {
        id: 4,
        content: "Hệ thống bảo trì server",
        time: "18:00",
        type: "system",
      },
    ],
  },
];

// --- HELPER COMPONENTS (ColumnWrapper, NotificationFeed) GIỮ NGUYÊN ---
const ColumnWrapper = ({ title, count, children, className = "" }: any) => (
  <div
    className={`flex flex-col h-full bg-column-bg rounded-xl border border-app-border/50 p-4 ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h3 className="font-bold text-sm text-text-muted tracking-tight uppercase">
          {title}
        </h3>
        <span className="flex items-center justify-center h-5 min-w-6 px-1.5 bg-badge-bg text-text-muted text-xs font-bold rounded-full border border-white shadow-sm">
          {count}
        </span>
      </div>
      <button className="p-1.5 text-text-muted hover:text-brand-600 hover:bg-white rounded-md transition-all cursor-pointer">
        <IoFilterSharp size={16} />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-custom pb-2">
      {children}
    </div>
  </div>
);

const NotificationFeed = () => {
  // (Giữ nguyên component này như cũ)
  return (
    <div className="h-full flex flex-col pt-4 pl-4 md:pl-6">
      <div className="flex items-center justify-between mb-4 pr-2">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
          Thông báo
        </h3>
        <button className="p-1.5 text-text-muted hover:text-brand-600 transition-colors cursor-pointer">
          <TbNotification size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-6">
        {notifications.map((group, gIndex) => (
          <div key={gIndex} className="relative">
            <h5 className="text-xs font-bold text-brand-600 mb-3 bg-brand-50 w-fit px-2.5 py-1 rounded-md ml-8">
              {group.dateGroup}
            </h5>
            <div className="relative">
              <div className="absolute left-2.75 top-2 bottom-0 w-px bg-linear-to-b from-app-border to-transparent"></div>
              {group.items.map((notif: any) => {
                let Icon = FiBell;
                let iconColor = "text-gray-500 bg-gray-100 border-gray-200";
                if (notif.type === "task") {
                  Icon = TbNotification;
                  iconColor = "text-blue-600 bg-blue-50 border-blue-100";
                }
                if (notif.type === "mention") {
                  Icon = FiMessageSquare;
                  iconColor = "text-purple-600 bg-purple-50 border-purple-100";
                }
                if (notif.type === "system") {
                  Icon = FiInfo;
                  iconColor = "text-orange-600 bg-orange-50 border-orange-100";
                }
                return (
                  <div
                    key={notif.id}
                    className="relative flex gap-3 items-start py-2.5 group cursor-pointer hover:bg-white/60 rounded-lg -ml-2 pl-2 transition-all"
                  >
                    <div
                      className={`relative z-10 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${iconColor}`}
                    >
                      <Icon size={12} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm text-text-main leading-snug font-medium group-hover:text-brand-600 transition-colors">
                        {notif.content}
                      </p>
                      <span className="text-xs text-text-muted mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center py-4 border-t border-dashed border-app-border/60 mt-auto">
        <button className="text-xs font-bold text-text-muted hover:text-brand-600 uppercase tracking-wider transition-colors">
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const MySchedulePage = () => {
  const [currentView, setCurrentView] = useState<"schedule" | "freeTime">(
    "schedule"
  );
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // STATE CẤU HÌNH TOÀN CỤC
  const [appConfig, setAppConfig] = useState<ConfigType>({
    taskDisplayMode: "remaining", // hoặc 'dateRange'
    sortBy: "default", // hoặc 'priority', 'progress'
    showCompleted: true, // hoặc false
  });

  // LOGIC SẮP XẾP & LỌC NHIỆM VỤ DỰA TRÊN CẤU HÌNH
  const getProcessedMissions = () => {
    let processed = [...missionsData];

    // 1. Lọc hoàn thành
    if (!appConfig.showCompleted) {
      processed = processed.filter((m) => m.progress < 100);
    }

    // 2. Sắp xếp
    if (appConfig.sortBy === "progress") {
      processed.sort((a, b) => b.progress - a.progress);
    } else if (appConfig.sortBy === "priority") {
      const priorityMap: any = { high: 3, medium: 2, low: 1 };
      processed.sort(
        (a, b) => priorityMap[b.priority] - priorityMap[a.priority]
      );
    }

    return processed;
  };

  const processedMissions = getProcessedMissions();

  return (
    <div className="h-screen bg-app-bg p-4 md:p-6 font-sans text-text-main flex flex-col overflow-hidden relative">
      {/* MODAL CONFIG */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={appConfig}
        onSave={setAppConfig}
      />

      {currentView === "freeTime" ? (
        <FreeTimeView
          onBack={() => setCurrentView("schedule")}
          onOpenConfig={() => setIsConfigOpen(true)}
        />
      ) : (
        <>
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main">
                Lịch trình của tôi
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Quản lý công việc và thời gian hiệu quả
              </p>
            </div>

            <ScheduleHeaderButtons
              onFreeTimeClick={() => setCurrentView("freeTime")}
              onConfigClick={() => setIsConfigOpen(true)}
            />
          </header>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* === COLUMN 1: NHIỆM VỤ === */}
            <ColumnWrapper
              title="Nhiệm vụ"
              count={processedMissions.length}
              className="lg:col-span-5"
            >
              {processedMissions.map((item) => {
                const isUrgent = item.progress < 50;
                const isDone = item.progress === 100;
                const isRead = item.isRead;

                return (
                  <div
                    key={item.id}
                    className="group bg-app-card p-4 rounded-task-card shadow-sm border border-app-border/60 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                  >
                    {!isRead && (
                      <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                      </span>
                    )}

                    <div className="flex justify-between items-start mb-3 pr-6">
                      <div className="flex flex-col gap-1.5">
                        {item.subId && (
                          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded w-fit">
                            {item.subId}
                          </span>
                        )}
                        <h4
                          className={`text-sm leading-snug group-hover:text-brand-600 transition-colors text-text-main ${
                            !isRead ? "font-bold" : "font-medium"
                          } `}
                        >
                          {item.title}
                        </h4>
                      </div>
                      <span className="px-2 py-1 bg-slate-100 text-text-muted text-xs font-bold rounded-md uppercase tracking-wide border border-slate-200">
                        {item.badge}
                      </span>
                    </div>

                    {/* --- LOGIC HIỂN THỊ DỰA VÀO CẤU HÌNH --- */}
                    <div className="flex items-center gap-2 mb-4 text-xs text-text-muted font-medium">
                      {appConfig.taskDisplayMode === "remaining" ? (
                        // Mode cũ: Thời gian còn lại
                        <>
                          <FiClock size={14} />
                          <span
                            className={`${
                              item.timeLeft.includes("Quá hạn")
                                ? "text-task-urgent"
                                : ""
                            }`}
                          >
                            {item.timeLeft}
                          </span>
                        </>
                      ) : (
                        // Mode mới: Ngày tháng
                        <>
                          <FiCalendar size={14} className="text-brand-600" />
                          <span className="text-brand-700 font-bold bg-brand-50 px-1.5 rounded">
                            {item.startDate} - {item.endDate}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isDone
                              ? "bg-task-done"
                              : isUrgent
                              ? "bg-task-urgent"
                              : "bg-brand-500"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-bold min-w-8 text-right ${
                          isDone
                            ? "text-task-done"
                            : isUrgent
                            ? "text-task-urgent"
                            : "text-brand-600"
                        }`}
                      >
                        {item.progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </ColumnWrapper>

            {/* === COLUMN 2: HOẠT ĐỘNG (GIỮ NGUYÊN) === */}
            <ColumnWrapper
              title="Hoạt động"
              count={4}
              className="lg:col-span-5"
            >
              {activities.map((group, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-3 ml-1">
                    <FiCalendar size={14} className="text-text-muted" />
                    <h5 className="text-text-muted text-xs font-bold uppercase tracking-wide">
                      {group.dateGroup}
                    </h5>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((act) => {
                      let badgeBg = "bg-brand-100 text-brand-700";
                      let borderLeft = "border-l-brand-500";
                      if (act.color === "purple") {
                        badgeBg = "bg-purple-100 text-purple-700";
                        borderLeft = "border-l-purple-500";
                      }
                      if (act.color === "red") {
                        badgeBg = "bg-red-100 text-red-700";
                        borderLeft = "border-l-red-500";
                      }
                      return (
                        <div
                          key={act.id}
                          className={`bg-app-card p-4 rounded-r-lg rounded-l-sm shadow-sm border border-app-border/60 border-l-4 ${borderLeft} hover:shadow-md transition-all cursor-pointer flex justify-between items-center group`}
                        >
                          <div>
                            <h4 className="font-medium text-sm text-text-main group-hover:text-brand-600 transition-colors">
                              {act.title}
                            </h4>
                            <span className="text-xs text-text-muted mt-1 block font-medium">
                              {act.time}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${badgeBg}`}
                          >
                            {act.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </ColumnWrapper>

            <div className="lg:col-span-2 h-full border-l border-app-border/60 bg-transparent">
              <NotificationFeed />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MySchedulePage;
