
# Sweet Shop Management - Backend

This is the backend for the **Sweet Shop Management** system. It provides RESTful APIs for user authentication, managing sweets, and user roles. The backend is built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** with a **PostgreSQL** database.

---

## Features

- **User Management**
  - Register, login
  - Role management (`user`, `admin`, `superadmin`)
- **Sweet Management**
  - CRUD operations: Add, update, delete sweets
  - Search sweets by name, category, or price range
  - Purchase and restock sweets
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based authorization (`admin`, `superadmin`)
- **Database**
  - Prisma ORM for PostgreSQL

---

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Jest for testing

---

## Getting Started

### Prerequisites

- Node.js >= 18.x  
- PostgreSQL >= 14.x  
- npm >= 9.x  

### Setup

1. **Clone the repository**

```bash
git clone <repo-url>
cd sweet-shop-management/backend
````

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your database URL, JWT secret, backend port, and frontend URL:

```env
DATABASE_URL="postgresql://sweetuser:sweetpass@localhost:5432/sweetshop?connect_timeout=10&sslmode=prefer"
PORT=5000
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000
```

4. **Run Prisma migrations**

```bash
npx prisma migrate dev --name init
```

This will create the database tables (`User`, `Sweet`) and apply your schema.

5. **Generate Prisma Client**

```bash
npx prisma generate
```

6. **Seed superadmin credentials**

```bash
npm run seed
```

This will create a **superadmin user** if it doesn’t exist yet.

* Default email: `superadmin@sweetshop.com`
* Default password: `SuperSecret123!`

> ⚠️ **Important:** Change these credentials in `seed.ts` or `.env` for production.

7. **Start the backend**

    npx tsc
    node dist/server.js

The server will start at [http://localhost:5000](http://localhost:5000).

---

### Running Tests

Jest is used for testing:

```bash
npm run test
```

This will run all test suites and show coverage.

---

## API Endpoints

### Auth

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login user        |

### Users

| Method | Endpoint        | Description                         |
| ------ | --------------- | ----------------------------------- |
| GET    | /api/users      | Get all users                       |
| PUT    | /api/users/\:id | Update user role (admin/superadmin) |

### Sweets

| Method | Endpoint                  | Description                  |
| ------ | ------------------------- | ---------------------------- |
| GET    | /api/sweets               | Get all sweets               |
| POST   | /api/sweets               | Add a new sweet              |
| PUT    | /api/sweets/\:id          | Update sweet details         |
| DELETE | /api/sweets/\:id          | Delete a sweet               |
| POST   | /api/sweets/\:id/purchase | Purchase a sweet             |
| POST   | /api/sweets/\:id/restock  | Restock a sweet              |
| GET    | /api/sweets/search        | Search sweets (query params) |

---

```


```
