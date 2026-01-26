import { type NavigationItem } from "./../types/index.ts";

import { MdOutlineAssessment } from "react-icons/md";
import { AiOutlineSchedule, AiOutlineFileText } from "react-icons/ai";

import React from "react";

export const navData: NavigationItem[] = [
   {
      label: "Lịch trình của tôi",
      path: "/",
      icon: React.createElement(AiOutlineSchedule),
   },
   {
      label: "Nhiệm vụ cá nhân",
      path: "/personal-tasks",
      icon: React.createElement(AiOutlineFileText),
   },
   {
      label: "Tiến độ dự án",
      path: "/project-progress",
      icon: React.createElement(MdOutlineAssessment),
   },
   {
      label: "Nhóm ..",
      path: "/groups",
      icon: React.createElement(AiOutlineSchedule),
   },
   {
      path: "/notes",
      label: "Notes & Wiki",
      icon: React.createElement(AiOutlineFileText),
   },
];
