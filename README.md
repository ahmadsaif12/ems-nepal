# EMS Nepal — Employee Management System

A modern, responsive Employee Management System web application with dedicated **Admin** and **Employee** portals. Organizations can manage employees, track daily attendance, handle leave requests, and generate payslips — all from a clean, intuitive dashboard.

> **Status:** 🚧 Active development — the frontend is fully functional with mock data. Backend API integration is on the roadmap.

---

## ✨ Features

### 🔐 Authentication Portals
- Separate login flows for **Admin** and **Employee** roles
- Role-based dashboards and navigation

### 📊 Dashboard
- **Admin view:** organization-wide stats and overview
- **Employee view:** personal info, attendance summary, and quick actions

### 👥 Employee Management *(Admin)*
- Add, edit, and manage team members
- Search employees by name
- Filter by department (Engineering, HR, Marketing, Sales, Finance, and more)
- Card-based directory layout

### 🕐 Attendance
- Daily check-in / check-out button
- Attendance statistics (present days, hours worked, etc.)
- Full attendance history log

### 🏖️ Leave Management
- Request and track leave

### 💰 Payslips
- View salary slips
- Dedicated print-friendly payslip page (`/print/payslips/:id`)

### ⚙️ Settings
- Account and application preferences

---

## 🛠️ Tech Stack

| Category       | Technology                                        |
| -------------- | ------------------------------------------------- |
| Framework      | [React 19](https://react.dev)                     |
| Build Tool     | [Vite](https://vite.dev)                          |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com)        |
| Routing        | [React Router v7](https://reactrouter.com)        |
| Notifications  | [React Hot Toast](https://react-hot-toast.com)    |
| Icons          | [Lucide React](https://lucide.dev)                |
| Dates          | [date-fns](https://date-fns.org)                  |
| Linting        | [Oxlint](https://oxc.rs)                          |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmadsaif12/ems-nepal.git
cd ems-nepal

# 2. Install dependencies
cd client
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

Run these from the `client/` directory:

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start dev server with hot module reload  |
| `npm run build`   | Create a production build in `dist/`     |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Lint the codebase with Oxlint            |

---

## 🗺️ App Routes

| Route                 | Description                        |
| --------------------- | ---------------------------------- |
| `/login`              | Login landing page                 |
| `/login/admin`        | Admin portal login                 |
| `/login/employee`     | Employee portal login              |
| `/dashboard`          | Role-based dashboard               |
| `/employees`          | Employee management (admin)        |
| `/attendance`         | Check-in/out and attendance log    |
| `/leave`              | Leave management                   |
| `/payslips`           | Payslip list                       |
| `/print/payslips/:id` | Print-friendly payslip             |
| `/settings`           | Settings                           |

---

## 📁 Project Structure

```
EMS/
└── client/
    ├── public/              # Static assets (favicon, icons)
    └── src/
        ├── assets/          # Mock data & static imports
        ├── components/
        │   ├── attendance/  # Check-in button, stats, history
        │   ├── AdminDashboard.jsx
        │   ├── EmployeeDashboard.jsx
        │   ├── EmployeeCard.jsx
        │   ├── EmployeeForm.jsx
        │   ├── LoginForm.jsx
        │   ├── Sidebar.jsx
        │   └── ...
        ├── pages/           # Route-level pages
        ├── App.jsx          # Routes definition
        ├── index.css        # Global styles (Tailwind)
        └── main.jsx         # App entry point
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch from `development`
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add some amazing feature"
   ```
4. Push to the branch and open a Pull Request into `development`

Before submitting, make sure linting passes:

```bash
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License.
