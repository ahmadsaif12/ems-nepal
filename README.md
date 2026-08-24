# EMS Nepal — Employee Management System

A full-stack Employee Management System with dedicated **Admin** and **Employee** portals. Organizations can manage employees, track daily attendance, handle leave requests, and generate payslips — powered by a React frontend and an Express + MongoDB REST API.

> **Status:** 🚧 Active development — the backend API and core features are implemented; frontend/API integration is ongoing.

---

## ✨ Features

### 🔐 Authentication & Roles
- Separate login portals for **Admin** and **Employee**
- JWT-based authentication (`Authorization: Bearer <token>`)
- Role-based access control with admin-guarded endpoints

### 📊 Dashboard
- **Admin view:** organization-wide stats and overview
- **Employee view:** personal info, attendance summary, and quick actions

### 👥 Employee Management *(Admin)*
- Create, update, and soft-delete employees
- Search by name and filter by department (10 departments supported)
- Salary structure: basic salary, allowances, and deductions

### 🕐 Attendance
- Daily check-in / check-out clock
- Attendance statistics and full history log
- Day types (Full Day, Half Day, Three Quarter, Short Day) and status (Present / Absent / Late)

### 🏖️ Leave Management
- Employees apply for Sick, Casual, or Annual leave
- Admins approve or reject applications

### 💰 Payslips *(Admin)*
- Generate monthly payslips with automatic net salary calculation
- Print-friendly payslip page (`/print/payslips/:id`)

### ⚙️ Settings & Profile
- Update profile information and change password

---

## 🛠️ Tech Stack

### Frontend (`client/`)

| Category       | Technology                                     |
| -------------- | ---------------------------------------------- |
| Framework      | [React 19](https://react.dev)                  |
| Build Tool     | [Vite](https://vite.dev)                       |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com)     |
| Routing        | [React Router v7](https://reactrouter.com)     |
| Notifications  | [React Hot Toast](https://react-hot-toast.com) |
| Icons          | [Lucide React](https://lucide.dev)             |
| Dates          | [date-fns](https://date-fns.org)               |
| Linting        | [Oxlint](https://oxc.rs)                       |

### Backend (`server/`)

| Category         | Technology                                    |
| ---------------- | --------------------------------------------- |
| Runtime          | [Node.js](https://nodejs.org)                 |
| Framework        | [Express 5](https://expressjs.com)            |
| Database         | [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com) |
| Authentication   | [JWT](https://github.com/auth0/node-jsonwebtoken) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| File/Form Parser | [Multer](https://github.com/expressjs/multer) |
| Dev Server       | [Nodemon](https://nodemon.io)                 |

```
┌─────────────┐        ┌──────────────────┐        ┌─────────┐
│  React SPA  │ ─────► │  Express REST API │ ─────► │ MongoDB │
│  (Vite)     │  JSON  │  JWT protected    │ Mongoose│         │
└─────────────┘        └──────────────────┘        └─────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** — a local instance or an [Atlas](https://www.mongodb.com/atlas) connection string

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmadsaif12/ems-nepal.git
cd ems-nepal

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `server/.env` file:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/ems
JWT_SECRET=your_secret_key_here
```

### Running the Apps

```bash
# Terminal 1 — start the API (from server/)
npm run server

# Terminal 2 — start the frontend (from client/)
npm run dev
```

- Frontend: **http://localhost:5173**
- API: **http://localhost:4000**

### Available Scripts

| Directory   | Command             | Description                              |
| ----------- | ------------------- | ---------------------------------------- |
| `server/`   | `npm run server`    | Start API with hot reload (Nodemon)      |
| `server/`   | `npm start`         | Start API in production mode             |
| `client/`   | `npm run dev`       | Start dev server with HMR                |
| `client/`   | `npm run build`     | Create production build in `dist/`       |
| `client/`   | `npm run preview`   | Preview the production build locally     |
| `client/`   | `npm run lint`      | Lint the codebase with Oxlint            |

---

## 📡 API Reference

Base URL: `http://localhost:4000`

All routes except `/api/auth/login` require an `Authorization: Bearer <token>` header. Routes marked 🔒 are admin-only.

### Auth — `/api/auth`

| Method | Endpoint           | Description                          | Access   |
| ------ | ------------------ | ------------------------------------ | -------- |
| POST   | `/api/auth/login`  | Authenticate, returns a JWT          | Public   |
| GET    | `/api/auth/session`| Get current session info             | Any user |
| POST   | `/api/auth/change-password` | Change account password    | Any user |

### Employees — `/api/employees`

| Method | Endpoint              | Description                    | Access |
| ------ | --------------------- | ------------------------------ | ------ |
| GET    | `/api/employees`      | List all employees             | 🔒 Admin |
| POST   | `/api/employees`      | Create employee (+ user account) | 🔒 Admin |
| PUT    | `/api/employees/:id`  | Update employee details        | 🔒 Admin |
| DELETE | `/api/employees/:id`  | Soft-delete employee           | 🔒 Admin |

### Profile — `/api/profile`

| Method | Endpoint         | Description                     | Access   |
| ------ | ---------------- | ------------------------------- | -------- |
| GET    | `/api/profile`   | Get own profile                 | Any user |
| POST   | `/api/profile`   | Update own profile              | Any user |

### Attendance — `/api/attendance`

| Method | Endpoint            | Description                          | Access   |
| ------ | ------------------- | ------------------------------------ | -------- |
| POST   | `/api/attendance`   | Clock in / clock out for today       | Any user |
| GET    | `/api/attendance`   | Get attendance history               | Any user |

### Leave — `/leave`

| Method   | Endpoint        | Description                        | Access   |
| -------- | --------------- | ---------------------------------- | -------- |
| POST     | `/leave`        | Submit a leave application         | Any user |
| GET      | `/leave`        | Get leave applications             | Any user |
| PATCH    | `/leave/:id`    | Approve / reject application       | 🔒 Admin |

### Payslips — `/api/payslips`

| Method | Endpoint             | Description                   | Access   |
| ------ | -------------------- | ----------------------------- | -------- |
| POST   | `/api/payslips`      | Generate a monthly payslip    | 🔒 Admin |
| GET    | `/api/payslips`      | List payslips                 | 🔒 Admin |
| GET    | `/api/payslips/:id`  | Get payslip details           | 🔒 Admin |

---

## 🗃️ Data Models

| Model              | Key Fields                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **User**           | `email`, `password` (hashed), `role` (`ADMIN` \| `EMPLOYEE`)                                             |
| **Employee**       | `userId`, name, contact, `position`, `department`, salary fields (`basicSalary`, `allowances`, `deductions`), `employmentStatus`, `joinedDate`, `isDeleted` (soft delete) |
| **Attendance**     | `employeeId`, `date` (unique per employee/day), `checkIn`, `checkOut`, `dayType`, `workingHours`, `status` |
| **LeaveApplication** | `employeeId`, `type` (Sick/Casual/Annual), `startDate`, `endDate`, `reason`, `status` (Pending/Approved/Rejected) |
| **Payslip**        | `employeeId`, `month`, `year`, salary breakdown, `netSalary`                                              |

---

## 🗺️ Frontend Routes

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
├── client/                      # React frontend (Vite)
│   ├── public/                  # Static assets
│   └── src/
│       ├── assets/              # Mock data & static imports
│       ├── components/
│       │   ├── attendance/      # Check-in button, stats, history
│       │   ├── leave/           # Apply modal, history
│       │   ├── payslip/         # Generator form, list
│       │   ├── AdminDashboard.jsx
│       │   ├── EmployeeDashboard.jsx
│       │   ├── EmployeeForm.jsx
│       │   ├── LoginForm.jsx
│       │   └── Sidebar.jsx
│       ├── pages/               # Route-level pages
│       ├── App.jsx              # Routes definition
│       └── main.jsx             # Entry point
└── server/                      # Express REST API
    ├── config/db.js             # MongoDB connection
    ├── constants/department.js  # Department list
    ├── controllers/             # Business logic per feature
    ├── middleware/auth.js       # JWT verify + role guard
    ├── models/                  # Mongoose schemas
    ├── routes/                  # Express routers
    └── server.js                # App entry point
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
cd client && npm run lint
```

---

## 📄 License

This project is licensed under the MIT License.
