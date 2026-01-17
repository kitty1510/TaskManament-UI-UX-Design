import { type NavigationItem } from "./../types/index.ts";

import { AiOutlineSchedule, AiOutlineFileText } from "react-icons/ai";

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
    path: "/notes",
    label: "Notes & Wiki",
    icon: React.createElement(AiOutlineFileText),
  },
   
];
