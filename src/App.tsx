import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout.tsx";

import LoginPage from "./pages/LoginPage.tsx";
import NotFoundPage from "./pages/NotFound.tsx";
import MySchedulePage from "./pages/MySchedulePage.tsx";
import ProjectProgressPage from "./pages/ProjectProgressPage.tsx";

import "./App.css";
import NotesWiki from "./pages/NotesWiki.tsx";
import KanbanBoardPage from "./pages/KanbanBoardPage.tsx";

function App() {
  return (
    <BrowserRouter>
      {/* Routes chỉ được chứa Route con trực tiếp */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* --- NHÓM 2: Trang CÓ Sidebar (Dùng Layout) - Protected --- */}
        {/* Route này đóng vai trò là Wrapper, không có path riêng */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MySchedulePage />} />
          <Route path="/project-progress" element={<ProjectProgressPage />} />
          <Route path="/notes" element={<NotesWiki />} />
          <Route path="/kanban" element={<KanbanBoardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

