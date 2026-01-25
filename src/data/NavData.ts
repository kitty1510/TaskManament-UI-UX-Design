import { type NavigationItem } from "./../types/index.ts";

import { AiOutlineSchedule } from "react-icons/ai";
import { MdOutlineAssessment } from "react-icons/md";

import React from "react";

export const navData: NavigationItem[] = [
  {
    label: "Lịch trình của tôi",
    path: "/",
    icon: React.createElement(AiOutlineSchedule),
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
];
