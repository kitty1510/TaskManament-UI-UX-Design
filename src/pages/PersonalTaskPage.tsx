import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiStar, FiCircle, FiMenu } from "react-icons/fi";

// Mock data cho tasks
const tasksData = [
   { id: 1, name: "Task 1 - Setup Project", dueDate: "Today", starred: true, color: "#ecffbc" },
   { id: 2, name: "Task 2 - Build UI layout", dueDate: "Today", starred: false, color: "#cfffbc" },
   { id: 3, name: "Task 3 - Implement Component", dueDate: "Tomorrow", starred: true, color: "#bcffd2" },
   { id: 4, name: "Task 4 - Handle Interactions", dueDate: "Next week", starred: false, color: "#bcffed" },
   { id: 5, name: "Task 5 - Add forms", dueDate: "Tomorrow", starred: true, color: "#bcd3ff" },
   { id: 6, name: "Task 6 - Quality Check", dueDate: "Next week", starred: false, color: "#bcf3ff" },
];

const focusOptions = ["Personal Focus", "Recent Activities", "Starred", "Finished Tasks"];
const dateOptions = ["Today", "Tomorrow", "Next week", "Next month", "Other..."];

const PersonalTaskPage = () => {
   const [selectedFocus, setSelectedFocus] = useState("Personal Focus");
   const [selectedDate, setSelectedDate] = useState("Today");
   const [showFocusDropdown, setShowFocusDropdown] = useState(false);
   const [showDateDropdown, setShowDateDropdown] = useState(false);
   const [quickTask, setQuickTask] = useState("");
   const [tasks, setTasks] = useState(tasksData);

   const focusRef = useRef<HTMLDivElement>(null);
   const dateRef = useRef<HTMLDivElement>(null);

   // Click outside to close dropdown
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (focusRef.current && !focusRef.current.contains(event.target as Node)) {
            setShowFocusDropdown(false);
         }
         if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
            setShowDateDropdown(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Toggle star
   const toggleStar = (id: number) => {
      setTasks(tasks.map(task => 
         task.id === id ? { ...task, starred: !task.starred } : task
      ));
   };

   return (
      <div className="min-h-screen bg-white py-4 flex flex-col gap-6">
         {/* FOR YOU Badge - sát trái */}
         <div className="w-fit px-4 py-2 rounded-r-lg border border-black shadow-md bg-gradient-to-b from-gray-200/20 to-gray-200/20">
            <span className="text-xl font-semibold text-black">FOR YOU</span>
         </div>

         {/* Main Table - center */}
         <div className="max-w-5xl mx-auto w-full px-4">
            <div className="rounded-2xl shadow-lg overflow-hidden border-2 border-black">
               {/* Header */}
               <div className="flex">
                  {/* Left Header - Focus Dropdown */}
               <div ref={focusRef} className="flex-1 border-b-2 border-black bg-white relative">
                  <div 
                     className="flex items-center gap-3 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                     onClick={() => {
                        setShowFocusDropdown(!showFocusDropdown);
                        setShowDateDropdown(false);
                     }}
                  >
                     <FiMenu className="text-lg opacity-30" />
                     <span className="text-xl text-black">{selectedFocus}</span>
                     <FiChevronDown 
                        className={`text-lg text-gray-500 transition-transform duration-300 ${showFocusDropdown ? "rotate-180" : ""}`} 
                     />
                  </div>
                  
                  {/* Focus Dropdown Menu */}
                  <div className={`absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 overflow-hidden transition-all duration-300 ${showFocusDropdown ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                     {focusOptions.map((option) => (
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
               <div ref={dateRef} className="w-56 bg-blue-200/40 border-l-2 border-b-2 border-black rounded-tr-2xl relative">
                  <div 
                     className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-blue-200/60 transition-colors"
                     onClick={() => {
                        setShowDateDropdown(!showDateDropdown);
                        setShowFocusDropdown(false);
                     }}
                  >
                     <span className="text-xl text-black">{selectedDate}</span>
                     <FiChevronDown 
                        className={`text-xl text-yellow-500 transition-transform duration-300 ${showDateDropdown ? "rotate-180" : ""}`} 
                     />
                  </div>

                  {/* Date Dropdown Menu */}
                  <div className={`absolute top-full right-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 overflow-hidden transition-all duration-300 ${showDateDropdown ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                     {dateOptions.map((option) => (
                        <div
                           key={option}
                           className={`px-4 py-3 text-lg cursor-pointer transition-colors ${selectedDate === option ? "bg-brand-50 text-brand-600" : "hover:bg-gray-50"}`}
                           onClick={() => {
                              setSelectedDate(option);
                              setShowDateDropdown(false);
                           }}
                        >
                           {option}
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Task List */}
            <div className="bg-white">
               {tasks.map((task) => (
                  <div
                     key={task.id}
                     className="flex items-center px-6 py-3 shadow-sm hover:brightness-95 transition-all cursor-pointer group"
                     style={{ backgroundColor: task.color }}
                  >
                     {/* Checkbox */}
                     <FiCircle className="text-2xl text-black mr-6 cursor-pointer hover:text-brand-500 hover:scale-110 transition-all" />
                     
                     {/* Task Name */}
                     <span className="flex-1 text-xl text-black group-hover:text-brand-600 transition-colors">{task.name}</span>
                     
                     {/* Due Date */}
                     <span className="text-xl text-black/70 w-32 text-right mr-4">{task.dueDate}</span>
                     
                     {/* Star */}
                     <div 
                        className="p-2 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => toggleStar(task.id)}
                     >
                        <FiStar 
                           className={`text-2xl transition-colors ${task.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400 hover:text-yellow-400"}`}
                        />
                     </div>
                  </div>
               ))}

               {/* Quick Task Input */}
               <div className="flex items-center justify-center py-6 px-8">
                  <div className="flex w-full max-w-2xl shadow-sm">
                     <input
                        type="text"
                        placeholder="Type a task..."
                        value={quickTask}
                        onChange={(e) => setQuickTask(e.target.value)}
                        className="flex-1 px-4 py-2 text-xl border border-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                     />
                     <button className="px-8 py-2 text-xl font-medium bg-cyan-400/50 border border-l-0 border-black rounded-r-lg hover:bg-cyan-400/70 active:scale-95 transition-all">
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
