import { type NavigationItem } from "./../types/index.ts";

import { AiOutlineSchedule } from "react-icons/ai";
import { FiCheckSquare } from "react-icons/fi";

import React from "react";

export const navData: NavigationItem[] = [
   {
      label: "Lịch trình của tôi",
      path: "/",
      icon: React.createElement(AiOutlineSchedule),
   },
   {
      label: "Nhóm ..",
      path: "/groups",
      icon: React.createElement(AiOutlineSchedule),
   },
   {
      label: "Nhiệm vụ cá nhân",
      path: "/personal-tasks",
      icon: React.createElement(FiCheckSquare),
   },
];
