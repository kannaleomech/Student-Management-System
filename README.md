# Student Management System (Full-Stack)

A full-stack **Student Management System** built using **React.js**, **Node.js (Express.js)**, and **MySQL**.  
This project demonstrates **real-world architecture**, **role-based access control**, **audit logging**, and **analytics dashboard** with modern tools.

---

## 🚀 Tech Stack

### **Frontend**
- **React.js** (v19) with Hooks
- **Redux Toolkit** for state management
- **TanStack React Query** for data fetching/mutations
- **Axios** for API calls
- **React Router v6** for routing
- **Bootstrap 5** and **Bootstrap Icons**for UI
- **Formik** and **Yup** for form validation
- **React-Chartjs-2** & **Chart.js** for analytics
- **React-Toastify** for notifications
- **Vite** as the build tool
- **XLSX** for Excel import/export

### **Backend**
- **Node.js + Express.js**
- **Sequelize ORM** with **MySQL2**
- **JWT Authentication** for authentication.
- **BcryptJS** for password hashing
- **Multer** for image uploads
- **Morgan** for logging
- **CORS**  for Cross-Origin Resource Sharing.
- **Dotenv**  Loads environment variables from .env.
- **XLSX** for Excel handling
- **Nodemon** for development
- **Sequelize CLI** for migrations and seeders

---

## ✨ Core Features
1. **JWT-based Authentication**
   - User Registration & Login.
   - Secure token management.

2. **Student CRUD**
   - Add, Edit, View, Delete students.
   - Upload profile photos.

3. **Search, Filter & Pagination**
   - Search students by name and class.
   - Pagination with filter support.

4. **Excel Import/Export**
   - Export all students as `.xlsx`.
   - Import multiple students with validation (no duplicates).

5. **Role-Based Access Control (RBAC)**
   - **Admin**: Full control (Add, Edit, Delete).
   - **Teacher**: View-only access.

6. **Dashboard Analytics**
   - Total students.
   - Total class.
   - Students per class.
   - Gender ratio via **charts** (Pie/Bar).

7. **Audit Logs**
   - Tracks actions (Add/Edit/Delete).
   - Logs user, action type, timestamp, and changes.

---

## 🗂️ Project Structure

### **Frontend (`client/`)**
```
client/
│
├── public/
└── src/
    ├── api/          # API calls (Axios instances)
    ├── assets/       # Images, icons , css
    ├── components/   # Reusable components
    ├── helper/       # Utility/helper functions
    ├── hooks/        # Custom React hooks
    ├── pages/        # Page-level components
    ├── redux/        # Redux store, slices
    ├── App.jsx
    └── main.jsx
```

### **Backend (`server/`)**
```
server/
│
├── config/          # DB config, environment configs
├── controllers/     # Request handlers
├── migrations/      # Sequelize migrations
├── models/          # Sequelize models
├── routes/          # Express routes
├── seeders/         # Sample data seeders
├── uploads/         # Profile image uploads
├── server.js
└── ...
```

---

## ⚙️ Setup Instructions

### **1. Clone the Repository**
```bash
git clone https://github.com/kannaleomech/Student-Management-System.git
cd Student-Management-System
```

---

### **2. Backend Setup (Express + Sequelize)**
```bash
cd server
npm install
```

- Create a `.env` file:
```env
PORT=8600
JWT_SECRET="!@#$%^H0mechef*()_+#$^%"
DB_USER=root
DB_PASS=''
DB_NAME=student_db
DB_HOST=127.0.0.1
```

- Create database:
```bash
npx sequelize-cli db:create
```

- Run database migrations:
```bash
npx sequelize-cli db:migrate
```

- Run database seeders:
```bash
npx sequelize-cli db:seed:all
```

- Start the backend server:
```bash
npm run dev
```
---

### **3. Frontend Setup (React + Redux + React Query)**
```bash
cd ../client
npm install
```

- Create a `.env` file:
```env
VITE_APP_API_URL="http://localhost:8600/api"
VITE_APP_Image_URL="http://localhost:8600/uploads"
```


- Start the React development server:
```bash
npm run dev
```

---

### **4. Access the App**
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8600/api`

---

## 📊 Dashboard Features
- **Total Students Count**
- **Students per Class**
- **Gender ratio** via **Chart.js**.

---

## 📦 Excel Import/Export
- **Export:** Click the **Export** button on the student list page.
- **Import:** Upload a `.xlsx` file with student details (validated before inserting).

---

## 🔒 Role-Based Access
- **Admin**: Full CRUD + Import/Export + Analytics.
- **Teacher**: Read-only dashboard & student data.

---

## 📝 Audit Logs
All actions (Add/Edit/Delete) are stored with:
- **User** (who performed action)
- **Action Type** (Add/Edit/Delete)
- **Timestamp**
- **Changed Data**

---

## 📌 Future Improvements
- Advanced filters (gender/class combined).
- Bulk delete or update.
- Email notifications on student addition.

---

## 🧑‍💻 Author
**Kannabiran**  
[GitHub](https://github.com/kannaleomech)

---
