import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout.tsx";

import LoginPage from "./pages/LoginPage.tsx";
import NotFoundPage from "./pages/NotFound.tsx";
import MySchedulePage from "./pages/MySchedulePage.tsx";
import PersonalTaskPage from "./pages/PersonalTaskPage.tsx";

import "./App.css";

function App() {
   return (
      <BrowserRouter>
         {/* Routes chỉ được chứa Route con trực tiếp */}
         <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* --- Trang CÓ Sidebar chính --- */}
            <Route element={<MainLayout />}>
               <Route path="/" element={<MySchedulePage />} />
               <Route path="/personal-tasks" element={<PersonalTaskPage />} />
               <Route path="*" element={<NotFoundPage />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
