import { useState, useEffect } from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { type NavigationItem } from "../../types/index.ts";
import { navData } from "../../data/NavData.ts";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SideBarProps {
   navigationItems?: NavigationItem[];
   title?: string;
}

const SideBar = ({
   navigationItems = navData,
   title = "Tasktin",
}: SideBarProps) => {
   const user = { username: "Username" };
   const location = useLocation();
   const navigate = useNavigate();

   const itemsToDisplay = navigationItems || navData;

   const [isCollapsed, setIsCollapsed] = useState(false);

   //
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth < 768) {
            setIsCollapsed(true);
         }
      };
      // Initial check
      handleResize();

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return (
      <>
         {}
         {!isCollapsed && (
            <div
               className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
               onClick={() => setIsCollapsed(true)}
            />
         )}

         {/* LAYER 2: SIDEBAR */}
         <div
            className={`
          h-screen bg-app-card border-r border-app-border flex flex-col transition-all duration-300
          
          /* --- LOGIC QUAN TRỌNG Ở ĐÂY --- */
          /* Mobile: Luôn Fixed đè lên content, Z-index cao hơn backdrop */
          fixed left-0 top-0 z-50 
          
          /* Desktop (md): Trở về Relative để đẩy content sang phải */
          md:relative md:z-auto

          ${isCollapsed ? "w-14" : "w-80"}
        `}
         >
            {/* --- HEADER --- */}
            <div
               className={`flex items-center p-4 ${
                  isCollapsed ? "justify-center" : "justify-between"
               }`}
            >
               {!isCollapsed && (
                  <div>
                     {" "}
                     <h2 className="font-bold text-2xl text-text-main">
                        Management Project
                     </h2>
                     <h2 className="font-bold text-2xl text-text-main">
                        {title}
                     </h2>{" "}
                  </div>
               )}
               <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-text-main hover:text-brand-500 transition-colors"
               >
                  {isCollapsed ? (
                     <CiCircleChevRight size={32} />
                  ) : (
                     <CiCircleChevLeft size={32} />
                  )}
               </button>
            </div>

            {/* --- NAVIGATION --- */}
            <nav className="flex-1 mt-4 px-2 overflow-y-auto">
               <ul className="space-y-2">
                  {itemsToDisplay.map((item) => {
                     const isActive = location.pathname === item.path;
                     return (
                        <li key={item.path}>
                           <Link
                              to={item.path}
                              onClick={() => {
                                 if (window.innerWidth < 768)
                                    setIsCollapsed(true);
                              }}
                              className={`
                      flex items-center py-2 rounded-lg transition-colors
                      ${isCollapsed ? "justify-center px-0" : "px-4 gap-3"}
                      ${
                         isActive
                            ? "bg-brand-500 text-white"
                            : "text-text-muted hover:bg-brand-50 hover:text-brand-600"
                      }
                    `}
                              title={isCollapsed ? item.label : ""}
                           >
                              {item.icon && (
                                 <div className="text-2xl shrink-0">
                                    {item.icon}
                                 </div>
                              )}
                              {!isCollapsed && (
                                 <span className="text-xl font-semibold whitespace-nowrap overflow-hidden">
                                    {item.label}
                                 </span>
                              )}
                           </Link>
                        </li>
                     );
                  })}
               </ul>
            </nav>

            {/* --- FOOTER --- */}
            <div className="px-2 py-4">
               <div
                  className={`flex items-center ${
                     isCollapsed ? "justify-center px-0" : "px-4 gap-3"
                  }`}
                  onClick={() => navigate("/doctor-profile")}
                  style={{ cursor: "pointer" }}
               >
                  <div className="h-12 w-12 rounded-full shrink-0">
                     <img
                        src="https://avatar.iran.liara.run/public"
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                     />
                  </div>
                  {!isCollapsed && (
                     <div className="flex-1 min-w-0">
                        <p className="font-bold text-xl text-text-main truncate">
                           {user?.username || "Doctor Name"}
                        </p>
                     </div>
                  )}
               </div>
               <button
                  className="flex w-full items-center justify-center py-2 rounded-md text-xl 
            text-text-muted hover:bg-red-50 hover:text-red-600 transition duration-400 mt-3"
               >
                  <FiLogOut className="mr-1" />
                  {!isCollapsed && <span>Đăng xuất</span>}
               </button>
               <div className="mt-16 md:mt-0 "> </div>
            </div>
         </div>
      </>
   );
};

export default SideBar;
