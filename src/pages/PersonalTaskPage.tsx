import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiStar, FiCircle, FiMenu } from "react-icons/fi";

// Mock data cho tasks
const tasksData = [
   {
      id: 1,
      name: "Task 1 - Setup Project",
      dueDate: "Today",
      starred: true,
      color: "#ecffbc",
   },
   {
      id: 2,
      name: "Task 2 - Build UI layout",
      dueDate: "Today",
      starred: false,
      color: "#cfffbc",
   },
   {
      id: 3,
      name: "Task 3 - Implement Component",
      dueDate: "Tomorrow",
      starred: true,
      color: "#bcffd2",
   },
   {
      id: 4,
      name: "Task 4 - Handle Interactions",
      dueDate: "Next week",
      starred: false,
      color: "#bcffed",
   },
   {
      id: 5,
      name: "Task 5 - Add forms",
      dueDate: "Tomorrow",
      starred: true,
      color: "#bcd3ff",
   },
   {
      id: 6,
      name: "Task 6 - Quality Check",
      dueDate: "Next week",
      starred: false,
      color: "#bcf3ff",
   },
];

// const focusOptions = [
//    "Personal Focus",
//    "Recent Activities",
//    "Starred",
//    "Finished Tasks",
// ];
// const dateOptions = [
//    "Today",
//    "Tomorrow",
//    "Next week",
//    "Next month",
//    "Other...",
// ];

const PersonalTaskPage = () => {
   // Popup state
   const [popup, setPopup] = useState<null | {
      type: "move" | "done";
      task: any;
   }>(null);
   const [removedTask, setRemovedTask] = useState<any>(null);
   const [selectedFocus, setSelectedFocus] = useState("Personal Focus");
   const [focusOptions, setFocusOptions] = useState<string[] | null>(null);
   // Giả lập gọi API lấy dropdown focus options
   useEffect(() => {
      setFocusOptions(null); // loading state
      setTimeout(() => {
         setFocusOptions([
            "Personal Focus",
            "Recent Activities",
            "Starred",
            "Finished Tasks",
         ]);
      }, 1200); // giả lập delay 1.2s
   }, []);
   const [selectedDate, setSelectedDate] = useState("Today");
   const [dateOptions, setDateOptions] = useState<string[] | null>(null);
   const [dateInfo, setDateInfo] = useState<string | null>(null);
   // Giả lập gọi API lấy dropdown date options
   useEffect(() => {
      setDateOptions(null); // loading state
      setTimeout(() => {
         setDateOptions([
            "Today",
            "Tomorrow",
            "Next week",
            "Next month",
            "Other...",
         ]);
      }, 1200); // giả lập delay 1.2s
   }, []);
   const [showFocusDropdown, setShowFocusDropdown] = useState(false);
   const [showDateDropdown, setShowDateDropdown] = useState(false);
   const [quickTask, setQuickTask] = useState("");
   const [tasks, setTasks] = useState(tasksData);
   // Lọc task theo dropdown
   const filteredTasks = tasks.filter((task) => {
      // Lọc theo ngày
      let dateMatch =
         selectedDate === "Today"
            ? task.dueDate === "Today"
            : selectedDate === "Tomorrow"
              ? task.dueDate === "Tomorrow"
              : selectedDate === "Next week"
                ? task.dueDate === "Next week"
                : selectedDate === "Next month"
                  ? task.dueDate === "Next month"
                  : true;
      // Lọc theo focus
      let focusMatch = true;
      if (selectedFocus === "Starred") focusMatch = task.starred;
      else if (selectedFocus === "Finished Tasks") focusMatch = false; // Chưa có trạng thái done, tạm thời không hiện
      // Personal Focus và Recent Activities: hiện tất cả
      return dateMatch && focusMatch;
   });
   const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
   const [datePickerTaskId, setDatePickerTaskId] = useState<number | null>(
      null,
   );

   // Thêm task mới khi nhập và bấm Enter
   const handleAddTask = () => {
      let name = quickTask.trim();
      const newId =
         tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
      let finalName = `Task ${newId} - ${name}`;
      if (!name) {
         finalName = `Task ${newId} - New Task`;
      }
      setTasks([
         {
            id: newId,
            name: finalName,
            dueDate: selectedDate,
            starred: false,
            color: "#fffbe6",
         },
         ...tasks,
      ]);
      setQuickTask("");
      setDateInfo(`Đã thêm: ${finalName}`);
   };

   const focusRef = useRef<HTMLDivElement>(null);
   const dateRef = useRef<HTMLDivElement>(null);

   // Đóng action khi click ra ngoài action row
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         const actionRow = document.getElementById("task-action-row");
         if (actionRow && !actionRow.contains(event.target as Node)) {
            setActiveTaskId(null);
         }
      };
      if (activeTaskId !== null) {
         document.addEventListener("mousedown", handleClickOutside);
      }
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, [activeTaskId]);
   // Click outside to close dropdown
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            focusRef.current &&
            !focusRef.current.contains(event.target as Node)
         ) {
            setShowFocusDropdown(false);
         }
         if (
            dateRef.current &&
            !dateRef.current.contains(event.target as Node)
         ) {
            setShowDateDropdown(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Toggle star
   const toggleStar = (id: number) => {
      setTasks(
         tasks.map((task) =>
            task.id === id ? { ...task, starred: !task.starred } : task,
         ),
      );
   };

   // Handler cho nút Done
   const handleDoneTask = (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
         setPopup({ type: "done", task });
      }
      setActiveTaskId(null);
   };

   // Handler cho Move to Today
   const handleMoveToToday = (id: number) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
         setPopup({ type: "move", task });
      }
      setActiveTaskId(null);
   };
   // Xử lý Undo popup
   const handleUndoPopup = () => {
      if (!popup) return;
      if (popup.type === "move") {
         // Không thay đổi gì
      } else if (popup.type === "done") {
         // Nếu task đã bị xóa thì khôi phục lại
         if (removedTask) {
            setTasks((prev) => [removedTask, ...prev]);
            setRemovedTask(null);
         }
      }
      setPopup(null);
   };

   // Xử lý Close popup
   const handleClosePopup = () => {
      if (!popup) return;
      if (popup.type === "move") {
         // Move to Today
         setTasks(
            tasks.map((task) =>
               task.id === popup.task.id ? { ...task, dueDate: "Today" } : task,
            ),
         );
      } else if (popup.type === "done") {
         // Remove task
         setRemovedTask(popup.task);
         setTasks(tasks.filter((task) => task.id !== popup.task.id));
      }
      setPopup(null);
   };

   // Handler cho Edit: mở date picker
   const handleEditTask = (id: number) => {
      setDatePickerTaskId(id);
   };

   // Đóng date picker khi click ra ngoài
   useEffect(() => {
      if (datePickerTaskId === null) return;
      const handleClickOutside = (event: MouseEvent) => {
         const picker = document.getElementById("date-picker-modal");
         if (picker && !picker.contains(event.target as Node)) {
            setDatePickerTaskId(null);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, [datePickerTaskId]);

   // Tự động ẩn toast sau 5s
   useEffect(() => {
      if (!dateInfo) return;
      const timer = setTimeout(() => setDateInfo(null), 5000);
      return () => clearTimeout(timer);
   }, [dateInfo]);

   return (
      <div className="min-h-screen bg-white py-4 flex flex-col gap-6">
         {/* FOR YOU Badge - sát trái */}
         <div className="w-fit px-4 py-2 rounded-r-lg border border-black shadow-md bg-gradient-to-b from-gray-200/20 to-gray-200/20">
            <span className="text-xl font-semibold text-black">FOR YOU</span>
         </div>

         {/* Main Table - center */}
         <div className="max-w-5xl mx-auto w-full px-4">
            <div className="rounded-2xl shadow-lg overflow-hidden border-4 border-blue-400 bg-gradient-to-br from-blue-50 to-white p-2">
               {/* Header */}
               <div className="flex justify-center items-center mt-4 gap-4">
                  {/* Left Header - Focus Dropdown */}
                  <div
                     ref={focusRef}
                     className="flex-1 border-b-2 border-blue-400 bg-white relative rounded-tl-2xl shadow-sm"
                  >
                     <div
                        className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-blue-100 transition-colors border-2 border-blue-300 rounded-tl-2xl shadow"
                        onClick={() => {
                           if (focusOptions) {
                              setShowFocusDropdown(!showFocusDropdown);
                              setShowDateDropdown(false);
                           }
                        }}
                     >
                        <FiMenu className="text-lg opacity-50" />
                        <span className="text-xl text-blue-700 font-bold">
                           {focusOptions ? selectedFocus : "Đang tải..."}
                        </span>
                        <FiChevronDown
                           className={`text-lg text-blue-500 transition-transform duration-300 ${showFocusDropdown ? "rotate-180" : ""}`}
                        />
                     </div>

                     {/* Focus Dropdown Menu */}
                     <div
                        className={`absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 overflow-hidden transition-all duration-300 ${showFocusDropdown ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
                     >
                        {!focusOptions && (
                           <div className="px-6 py-4 text-center text-gray-400">
                              Đang tải...
                           </div>
                        )}
                        {focusOptions &&
                           focusOptions.map((option) => (
                              <div
                                 key={option}
                                 className={`px-6 py-3 text-lg cursor-pointer transition-colors ${selectedFocus === option ? "bg-brand-50 text-brand-600" : "hover:bg-gray-50"}`}
                                 onClick={() => {
                                    setSelectedFocus(option);
                                    setShowFocusDropdown(false);
                                 }}
                              >
                                 {option}
                              </div>
                           ))}
                     </div>
                  </div>

                  {/* Right Header - Date Dropdown */}
                  <div
                     ref={dateRef}
                     className="w-56 bg-blue-100 border-l-2 border-b-2 border-blue-400 rounded-tr-2xl relative shadow-sm"
                  >
                     <div
                        className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-blue-200/80 transition-colors border-2 border-blue-300 rounded-tr-2xl shadow"
                        onClick={() => {
                           if (dateOptions) {
                              setShowDateDropdown(!showDateDropdown);
                              setShowFocusDropdown(false);
                           }
                        }}
                     >
                        <span className="text-xl text-blue-700 font-bold">
                           {dateOptions ? selectedDate : "Đang tải..."}
                        </span>
                        <FiChevronDown
                           className={`text-xl text-yellow-500 transition-transform duration-300 ${showDateDropdown ? "rotate-180" : ""}`}
                        />
                     </div>

                     {/* Date Dropdown Menu */}
                     <div
                        className={`absolute top-full right-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 overflow-hidden transition-all duration-300 ${showDateDropdown ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
                     >
                        {!dateOptions && (
                           <div className="px-4 py-4 text-center text-gray-400">
                              Đang tải...
                           </div>
                        )}
                        {dateOptions &&
                           dateOptions.map((option) => (
                              <div
                                 key={option}
                                 className={`px-4 py-3 text-lg cursor-pointer transition-colors ${selectedDate === option ? "bg-brand-50 text-brand-600" : "hover:bg-gray-50"}`}
                                 onClick={() => {
                                    setSelectedDate(option);
                                    setShowDateDropdown(false);
                                    setDateInfo(`Bạn đã chọn: ${option}`);
                                 }}
                              >
                                 {option}
                              </div>
                           ))}
                     </div>
                     {/* Toast notification sẽ hiển thị ở ngoài */}
                     {/* Toast notification */}
                     {dateInfo && (
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                           <span className="font-semibold">{dateInfo}</span>
                        </div>
                     )}
                     {/* CSS animation cho toast */}
                     <style>{`
            @keyframes fadeInOut {
               0% { opacity: 0; transform: translateY(-20px); }
               10% { opacity: 1; transform: translateY(0); }
               90% { opacity: 1; transform: translateY(0); }
               100% { opacity: 0; transform: translateY(-20px); }
            }
            .animate-fade-in-out {
               animation: fadeInOut 5s both;
            }
         `}</style>
                  </div>
               </div>

               {/* Task List */}
               <div className="bg-white p-2 md:p-6 rounded-b-2xl border-t-2 border-blue-100">
                  {filteredTasks.map((task) => (
                     <div key={task.id + "-wrapper"}>
                        <div
                           className={`flex items-center px-6 py-3 shadow-sm hover:brightness-95 transition-all cursor-pointer group ${activeTaskId === task.id ? "ring-2 ring-cyan-400 z-10 relative" : ""}`}
                           style={{ backgroundColor: task.color }}
                           onClick={() =>
                              setActiveTaskId(
                                 activeTaskId === task.id ? null : task.id,
                              )
                           }
                        >
                           {/* Checkbox */}
                           <FiCircle className="text-2xl text-black mr-6 cursor-pointer hover:text-brand-500 hover:scale-110 transition-all" />
                           {/* Task Name */}
                           <span className="flex-1 text-xl text-black group-hover:text-brand-600 transition-colors">
                              {task.name}
                           </span>
                           {/* Due Date */}
                           <span className="text-xl text-black/70 w-32 text-right mr-4">
                              {task.dueDate}
                           </span>
                           {/* Star */}
                           <div
                              className="p-2 cursor-pointer hover:scale-125 transition-transform"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 toggleStar(task.id);
                                 setActiveTaskId(null);
                              }}
                           >
                              <FiStar
                                 className={`text-2xl transition-colors ${task.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400 hover:text-yellow-400"}`}
                              />
                           </div>
                        </div>
                        {/* Action row dưới task đang active */}
                        {activeTaskId === task.id && (
                           <div
                              id="task-action-row"
                              className="flex w-full justify-between items-center gap-2 px-6 py-3 bg-white border-b border-x border-cyan-300 rounded-b-xl shadow-sm -mt-1 mb-2 z-20 relative"
                           >
                              <button
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTask(task.id);
                                 }}
                                 className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-md border border-gray-300 text-lg font-medium hover:bg-gray-200"
                              >
                                 Edit
                                 <span role="img" aria-label="calendar">
                                    📅
                                 </span>
                              </button>
                              {/* Date Picker Modal */}
                              {datePickerTaskId === task.id && (
                                 <div
                                    id="date-picker-modal"
                                    className="absolute left-1/2 top-full -translate-x-1/2 mt-2 bg-white border border-gray-300 rounded-xl shadow-xl p-4 z-50 flex flex-col items-center"
                                 >
                                    <span className="mb-2 text-lg font-semibold">
                                       Chọn ngày mới
                                    </span>
                                    <input
                                       type="date"
                                       className="border px-2 py-1 rounded mb-2"
                                       onClick={(e) => e.stopPropagation()}
                                    />
                                    <button
                                       className="mt-1 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          setDatePickerTaskId(null);
                                       }}
                                    >
                                       Đóng
                                    </button>
                                 </div>
                              )}
                              <button
                                 onClick={() => {
                                    handleMoveToToday(task.id);
                                 }}
                                 className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-md border border-gray-300 text-lg font-medium hover:bg-gray-200"
                              >
                                 Move to Today
                                 <span role="img" aria-label="edit">
                                    ✏️
                                 </span>
                              </button>
                              <button
                                 onClick={() => {
                                    handleDoneTask(task.id);
                                 }}
                                 className="flex items-center gap-1 px-6 py-2 bg-green-400 text-white rounded-md border border-green-500 text-lg font-semibold hover:bg-green-500"
                              >
                                 Done
                                 <span role="img" aria-label="check">
                                    ✔️
                                 </span>
                              </button>
                           </div>
                        )}
                     </div>
                  ))}
                  {/* Popup nổi ở giữa */}
                  {popup && (
                     <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/20">
                        <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center relative min-w-[340px] max-w-[90vw]">
                           <button
                              className="absolute top-3 right-3 text-2xl"
                              onClick={handleClosePopup}
                           >
                              &times;
                           </button>
                           <div className="mb-4">
                              <span className="block text-6xl text-yellow-400">
                                 🎉
                              </span>
                           </div>
                           <div className="mb-6 text-2xl font-bold text-center">
                              {popup.type === "move"
                                 ? "Moved to today!"
                                 : "Moved to done!"}
                           </div>
                           <div className="flex gap-4 w-full justify-center">
                              <button
                                 className="flex-1 border-2 border-black rounded-lg py-2 text-lg font-semibold bg-white hover:bg-gray-100"
                                 onClick={handleUndoPopup}
                              >
                                 Undo
                              </button>
                              <button
                                 className="flex-1 border-2 border-black rounded-lg py-2 text-lg font-semibold bg-black text-white hover:bg-gray-900"
                                 onClick={handleClosePopup}
                              >
                                 Close
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Quick Task Input */}
                  <div className="flex items-center justify-center py-6 px-8">
                     <div className="flex w-full max-w-2xl shadow-sm">
                        <input
                           type="text"
                           placeholder="Type a task..."
                           value={quickTask}
                           onChange={(e) => setQuickTask(e.target.value)}
                           className="flex-1 px-4 py-2 text-xl border border-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 handleAddTask();
                              }
                           }}
                        />
                        <button
                           className="px-8 py-2 text-xl font-medium bg-cyan-400/50 border border-l-0 border-black rounded-r-lg hover:bg-cyan-400/70 active:scale-95 transition-all"
                           onClick={handleAddTask}
                        >
                           Enter
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PersonalTaskPage;
