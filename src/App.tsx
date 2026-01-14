import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout.tsx";

import LoginPage from "./pages/LoginPage.tsx";
import NotFoundPage from "./pages/NotFound.tsx";
import MySchedulePage from "./pages/MySchedulePage.tsx";

import "./App.css";

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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
