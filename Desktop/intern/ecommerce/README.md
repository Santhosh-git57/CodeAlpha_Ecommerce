# Yash Cart - Basic Ecommerce (Express + MongoDB)

## Features Covered
- Product listings
- Product details page
- Shopping cart (client-side persistence)
- User registration/login (JWT)
- Order processing (checkout + order history)
- Database models for products, users, and orders
- Admin dashboard to manage customers, carts, orders, and products

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Express.js (Node.js)
- Database: MongoDB (Mongoose)

## Setup
1. Install dependencies:
   npm install
2. Create `.env` from template:
   copy .env.example .env
3. Start MongoDB locally (or change `MONGO_URI` to Atlas URL).
4. Seed sample products:
   npm run seed
5. Seed admin account:
   npm run seed:admin
6. Start server:
   npm run dev

App URL: http://localhost:5000
Admin URL: http://localhost:5000/admin.html
Admin login: admin@yashcart.com / admin123

## API Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/products`
- GET `/api/products/:id`
- GET `/api/cart` (auth)
- PUT `/api/cart/sync` (auth)
- POST `/api/orders` (auth)
- GET `/api/orders/my` (auth)
- GET `/api/admin/users` (admin)
- GET `/api/admin/carts` (admin)
- GET `/api/admin/orders` (admin)
- PATCH `/api/admin/orders/:id/status` (admin)
- GET `/api/admin/products` (admin)
- POST `/api/admin/products` (admin)
- PUT `/api/admin/products/:id` (admin)
- DELETE `/api/admin/products/:id` (admin)
