import { type NavigationItem } from "./../types/index.ts";

import { AiOutlineSchedule } from "react-icons/ai";

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
];
