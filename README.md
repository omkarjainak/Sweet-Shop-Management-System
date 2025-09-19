

# Sweet Shop Management System (SMS-dashboard)

A full-stack web application to manage a sweet shop’s inventory, sales, and users. Built with **React**, **Ant Design**, **Node.js/Express** backend, and **PostgreSQL**. Supports role-based access (user, admin, superadmin), sweet management, purchasing, inventory tracking, and user management.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)

   * [Backend](#backend)
   * [Frontend](#frontend)
3. [Screenshots](#screenshots)
4. [Testing](#testing)
5. [My AI Usage](#my-ai-usage)

---

## Project Overview

* **Users** can browse sweets, filter by name/category/price, and make purchases.
* **Admins** can add, edit, delete, and restock sweets.
* **Superadmins** can manage users’ roles.
* **Frontend**: React + Ant Design
* **Backend**: Node.js/Express + JWT authentication
* **Database**: PostgreSQL

**Features**:

* Role-based access control
* Purchase modal with quantity selection
* Inventory management with restocking
* User role management
* Search and filter sweets

---

## Setup Instructions

### Backend

1. Go to your backend folder:

```bash
cd sweet-shop-management/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env`:

```env
PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5432/sweetshop"
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

5. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

6. Seed superadmin user:

```bash
npm run seed
```

Default credentials:

* Email: `superadmin@sweetshop.com`
* Password: `SuperSecret123!`

> ⚠️ Change these in production.

7. Start backend server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### Frontend

1. Go to frontend folder:

```bash
cd sweet-shop-management/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start frontend development server:

```bash
npm run dev
```

* If using Vite: `http://localhost:5173/`
* If using CRA: `http://localhost:3000/`

> Make sure backend is running first.

---

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Sweet Management (Admin)

![Sweet Management](screenshots/sweet.png)

### User Management (Superadmin)

![User Management](screenshots/users.png)

### Inventory Management

![Inventory Management](screenshots/inventory.png)

---

## Testing

The project includes test suites for backend and frontend:

* **Backend**: API endpoints, authentication, CRUD operations
* **Frontend**: Component rendering, filter/search, purchase workflow

Run tests:

```bash
npm run test
```

**Test Report Screenshot**:

![alt text](<Screenshot from 2025-09-19 21-44-18.png>)
---

## My AI Usage

I used **ChatGPT (OpenAI)** as a development assistant. Specifically:

* **Code Templates & Boilerplate**
  Generated frontend/backend structure, React components, API routes.
* **Feature Implementation Guidance**
  Assisted with JWT authentication, role-based access, and REST APIs.
* **Debugging & Error Fixes**
  Provided solutions for React Hooks, ESLint, Vite/CRA, and API issues.
* **Documentation**
  Helped draft README, setup instructions.

> All code logic, testing, and integration were reviewed and manually verified by me.

---
## Screenshot

![alt text](<screenshot/Screenshot from 2025-09-19 21-06-13.png>)
![alt text](<screenshot/Screenshot from 2025-09-19 21-06-21.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-06-29.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-06-40.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-06-52.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-07-16.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-07-26.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-07-32.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-07-54.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-08-03.png>) 
![alt text](<screenshot/Screenshot from 2025-09-19 21-08-10.png>)
