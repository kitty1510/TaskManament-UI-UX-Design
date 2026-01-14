# Task Management UI/UX Design

Ứng dụng quản lý công việc (Task Management) được xây dựng với React, TypeScript, và Tailwind CSS v4. Dự án tập trung vào trải nghiệm người dùng với giao diện hiện đại và responsive.

## 🚀 Công nghệ sử dụng

- **React 19** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling với custom theme
- **React Router DOM v7** - Routing
- **React Icons** - Icon library

## 📁 Cấu trúc dự án

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx    # Layout chính của app
│   │   └── Sidebar.tsx        # Sidebar navigation với collapse
│   └── ui/                    # Các UI components tái sử dụng
├── pages/
│   ├── LoginPage.tsx          # Trang đăng nhập
│   ├── MySchedulePage.tsx     # Trang lịch trình chính
│   └── NotFound.tsx           # Trang 404
├── data/
│   └── NavData.ts             # Cấu hình navigation items
├── types/
│   └── index.ts               # TypeScript type definitions
├── assets/                    # Hình ảnh, fonts, static files
├── App.tsx                    # Root component
├── main.tsx                   # Entry point
└── index.css                  # Global styles & Tailwind theme
```

## 🎨 Hệ thống màu sắc (Theme)

Dự án sử dụng custom theme được định nghĩa trong `src/index.css`:

### Màu chủ đạo (Brand)

- `brand-50` - #eff6ff (Light blue background)
- `brand-500` - #3b82f6 (Primary blue)
- `brand-600` - #2563eb (Hover blue)
- `brand-700` - #1d4ed8 (Pressed blue)

### Màu nền & Bề mặt

- `app-bg` - #f8fafc (Nền chính)
- `app-card` - #ffffff (Nền card/sidebar)
- `app-border` - #e2e8f0 (Viền phân cách)

### Màu văn bản

- `text-main` - #1e293b (Văn bản chính)
- `text-muted` - #64748b (Văn bản phụ)

### Màu trạng thái Task

- `task-todo` - #64748b (Chưa làm)
- `task-doing` - #f59e0b (Đang làm)
- `task-done` - #10b981 (Hoàn thành)
- `task-urgent` - #ef4444 (Khẩn cấp)

## 🛠️ Cài đặt & Chạy dự án

### Prerequisites

- Node.js 18+
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5173`

### Build cho production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint code

```bash
npm run lint
```

## 📱 Responsive Design

- **Mobile First**: Sidebar collapse mặc định trên màn hình nhỏ
- **Breakpoints**: Sử dụng Tailwind breakpoints (md: 768px)
- **Sidebar behavior**:
  - Mobile: Fixed overlay với backdrop
  - Desktop: Relative, đẩy content sang phải

## 🧩 Components chính

### Sidebar Component

**Path**: `src/components/layout/Sidebar.tsx`

**Features**:

- Collapse/expand với animation
- Responsive (fixed trên mobile, relative trên desktop)
- Active state cho navigation items
- User profile section
- Logout button

**Props**:

```typescript
interface SideBarProps {
  navigationItems?: NavigationItem[];
}
```

### MainLayout Component

**Path**: `src/components/layout/MainLayout.tsx`

Wrapper layout bao gồm Sidebar và content area.

### Navigation Data

**Path**: `src/data/NavData.ts`

Định nghĩa các navigation items:

```typescript
export const navData: NavigationItem[] = [
  {
    label: "Lịch trình của tôi",
    path: "/",
    icon: React.createElement(AiOutlineSchedule),
  },
  // ... more items
];
```

## 🔧 Tùy chỉnh Theme

Chỉnh sửa file `src/index.css` trong block `@theme`:

```css
@theme {
  --color-brand-500: #your-color;
  --color-text-main: #your-color;
  /* ... */
}
```

Tailwind sẽ tự động sinh ra các utility classes tương ứng.

## 📝 TypeScript Types

### NavigationItem

```typescript
interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
```

## 🎯 Best Practices

1. **Components**: Tạo component nhỏ, tái sử dụng trong `src/components/ui/`
2. **Styling**: Ưu tiên sử dụng theme colors thay vì hard-code màu
3. **Types**: Định nghĩa types trong `src/types/`
4. **Data**: Tách configuration data vào `src/data/`
5. **Responsive**: Luôn test trên mobile & desktop

## 📦 Dependencies chính

- `react` & `react-dom` - v19.2.0
- `react-router-dom` - v7.12.0
- `tailwindcss` - v4.1.18
- `react-icons` - v5.5.0
- `typescript` - v5.9.3

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho mục đích học tập và demo UI/UX.

---

## 🔗 Links

- Repository: [TaskManament-UI-UX-Design](https://github.com/kitty1510/TaskManament-UI-UX-Design)
- Issues: [GitHub Issues](https://github.com/kitty1510/TaskManament-UI-UX-Design/issues)
  import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
